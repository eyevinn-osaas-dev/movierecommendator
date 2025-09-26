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
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAIKEY || 'default_openaikey'
});


app.use(express.json());
app.use(express.static('public')); // Serve HTML from the public folder

// OpenAI API request handler
/**
 * Handles the POST request to get movie recommendations.
 * @function
 * @name getRecommendations
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with movie recommendations or an error message.
 */
app.post('/get-recommendations', async (req, res) => {
    const { title } = req.body;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // You can use "gpt-4" if you have access to it
            messages: [
                { role: "system", content: "You are a movie recommendation assistant." },
                { role: "user", content: `Give me 1 movie recommendations similar to ${title} and 1 move recommendation that has the same feeling but different genre as ${title}.` }
            ],
            max_tokens: 200,
            temperature: 0.7
        });

        // Log the entire response object to see its structure
        console.log('OpenAI Response:', completion);

        // Safely access message content from choices
        if (completion.choices && completion.choices.length > 0 && completion.choices[0].message) {
            const messageContent = completion.choices[0].message.content;
            console.log('Message Content:', messageContent);

            res.json({ recommendations: messageContent.trim().split('\n') });
        } else {
            res.status(500).json({ error: 'No recommendations found in the response.' });
        }

    } catch (error) {
        console.error('Error fetching recommendations:', error);

        // Handle different types of OpenAI API errors
        if (error.status === 401) {
            res.status(401).json({ error: 'Invalid OpenAI API key' });
        } else if (error.status === 429) {
            res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
        } else if (error.status >= 500) {
            res.status(502).json({ error: 'OpenAI service unavailable. Please try again later.' });
        } else {
            res.status(500).json({ error: 'Error fetching recommendations' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
