/**
 * Express server that handles movie recommendation requests.
 * @module MovieRecommendationServer
 */

/**
 * Handles the POST request to get movie recommendations.
 * @function
 * @name getRecommendations
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with movie recommendations or an error message.
 */

/**
 * Starts the server on the specified port.
 * @function
 * @name startServer
 * @param {number} port - The port number to start the server on.
 * @returns {void}
 */
const express = require('express');
const { OpenAI } = require('openai');
const { Anthropic } = require('@anthropic-ai/sdk');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize AI clients
const openai = new OpenAI({
    apiKey: process.env.OPENAIKEY || 'default_openaikey'
});

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY || 'default_claudekey'
});


app.use(express.json());
app.use(express.static('public')); // Serve HTML from the public folder

// Web search function to get current movie information
async function searchMovieInfo(movieTitle) {
    try {
        const searchQuery = `${movieTitle} movie cast director plot summary reviews`;
        // Using DuckDuckGo instant answer API (free and no API key required)
        const response = await axios.get(`https://api.duckduckgo.com/`, {
            params: {
                q: searchQuery,
                format: 'json',
                no_html: '1',
                skip_disambig: '1'
            },
            timeout: 5000
        });

        let movieInfo = '';
        if (response.data.AbstractText) {
            movieInfo = response.data.AbstractText;
        } else if (response.data.Answer) {
            movieInfo = response.data.Answer;
        }

        return movieInfo ? `Current information about ${movieTitle}: ${movieInfo}` : null;
    } catch (error) {
        console.log('Web search failed, continuing without additional context:', error.message);
        return null;
    }
}

// AI recommendation functions
async function getOpenAIRecommendations(title) {
    // Get current movie info via web search
    const movieInfo = await searchMovieInfo(title);
    const contextMessage = movieInfo
        ? `Based on the movie "${title}" and this current information: ${movieInfo}\n\nGive me 2 movie recommendations:`
        : `Give me 2 movie recommendations for someone who liked "${title}":`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-11-20", // Latest available GPT-4o model with web search capability
        messages: [
            { role: "system", content: "You are a movie recommendation assistant with access to current movie information. Provide exactly 2 movie recommendations in a clear format, taking into account the most recent context about movies." },
            { role: "user", content: `${contextMessage} 1) One similar movie in the same genre, 2) One movie with similar themes but in a different genre. Format each recommendation as: "**Movie Title (Year)** - Brief description explaining why it's recommended."` }
        ],
        max_tokens: 350
        // Using default temperature for this model
    });

    return {
        provider: 'OpenAI GPT-4o (Latest + Web Search)',
        content: completion.choices[0].message.content,
        usage: completion.usage,
        searchEnhanced: !!movieInfo
    };
}

async function getClaudeRecommendations(title) {
    // Get current movie info via web search
    const movieInfo = await searchMovieInfo(title);
    const contextMessage = movieInfo
        ? `I enjoyed "${title}". Here's some current information about it: ${movieInfo}\n\nBased on this context, please provide exactly 2 movie recommendations:`
        : `I enjoyed "${title}". Please provide exactly 2 movie recommendations:`;

    const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022", // Latest available Claude 3.5 Sonnet model
        max_tokens: 350,
        messages: [
            {
                role: "user",
                content: `You are a movie recommendation assistant with access to current movie information. ${contextMessage} 1) One similar movie in the same genre, 2) One movie with similar themes but in a different genre. Format each recommendation as: "**Movie Title (Year)** - Brief description explaining why it's recommended."`
            }
        ]
    });

    return {
        provider: 'Claude 3.5 Sonnet (Latest + Web Search)',
        content: message.content[0].text,
        usage: message.usage,
        searchEnhanced: !!movieInfo
    };
}

// Main recommendation endpoint
app.post('/get-recommendations', async (req, res) => {
    const { title, provider = 'openai' } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Movie title is required' });
    }

    try {
        let result;

        if (provider === 'claude') {
            result = await getClaudeRecommendations(title);
        } else if (provider === 'openai') {
            result = await getOpenAIRecommendations(title);
        } else if (provider === 'both') {
            // Get recommendations from both providers
            const [openaiResult, claudeResult] = await Promise.allSettled([
                getOpenAIRecommendations(title),
                getClaudeRecommendations(title)
            ]);

            const recommendations = [];
            if (openaiResult.status === 'fulfilled') {
                recommendations.push(openaiResult.value);
            }
            if (claudeResult.status === 'fulfilled') {
                recommendations.push(claudeResult.value);
            }

            if (recommendations.length === 0) {
                throw new Error('All AI providers failed');
            }

            return res.json({
                success: true,
                recommendations,
                requestedMovie: title
            });
        } else {
            return res.status(400).json({ error: 'Invalid provider. Use "openai", "claude", or "both".' });
        }

        console.log(`${result.provider} Response:`, result);

        res.json({
            success: true,
            recommendations: [result],
            requestedMovie: title
        });

    } catch (error) {
        console.error('Error fetching recommendations:', error);

        // Handle different types of errors
        if (error.status === 401) {
            res.status(401).json({ error: 'Invalid API key' });
        } else if (error.status === 429) {
            res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
        } else if (error.status >= 500) {
            res.status(502).json({ error: 'AI service unavailable. Please try again later.' });
        } else {
            res.status(500).json({ error: 'Error fetching recommendations: ' + error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
