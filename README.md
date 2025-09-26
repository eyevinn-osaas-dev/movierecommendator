# 🎬 AI Movie Recommender

A sophisticated movie recommendation web application powered by multiple AI models with real-time web search enhancement.

## ✨ Features

- **Dual AI Integration**: Get recommendations from OpenAI GPT-4o and Anthropic Claude 3.5 Sonnet
- **Web Search Enhanced**: Real-time movie information retrieval via DuckDuckGo API
- **Modern UI**: Responsive, dark-themed interface with smooth animations
- **Multiple Provider Options**: Choose between OpenAI, Claude, or both simultaneously
- **Real-time Results**: Live recommendation generation with loading states and error handling

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key
- Anthropic Claude API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alexbj75/movierecommendator.git
   cd movierecommendator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAIKEY=your_openai_api_key_here
   CLAUDE_API_KEY=your_claude_api_key_here
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

1. Enter a movie title you enjoyed
2. Select your preferred AI provider:
   - **OpenAI GPT-4o**: Fast, creative recommendations
   - **Claude 3.5 Sonnet**: Thoughtful, detailed analysis
   - **Both AIs**: Get recommendations from both providers simultaneously
3. Click "Get Recommendations"
4. Enjoy personalized movie suggestions with explanations!

## 🔧 API Documentation

### POST `/get-recommendations`

Get movie recommendations based on a movie title.

**Request Body:**
```json
{
  "title": "The Matrix",
  "provider": "openai" | "claude" | "both"
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "provider": "OpenAI GPT-4o (Latest + Web Search)",
      "content": "**Blade Runner 2049 (2017)** - A visually stunning sci-fi sequel...",
      "usage": {
        "total_tokens": 245,
        "completion_tokens": 123
      },
      "searchEnhanced": true
    }
  ],
  "requestedMovie": "The Matrix"
}
```

**Error Responses:**
- `400`: Missing movie title or invalid provider
- `401`: Invalid API key
- `429`: Rate limit exceeded
- `502`: AI service unavailable

## 🏗️ Architecture

### Backend (Node.js/Express)
- **Express Server**: Handles HTTP requests and serves static files
- **OpenAI Integration**: Official OpenAI SDK v5.23.0
- **Claude Integration**: Official Anthropic SDK v0.63.1
- **Web Search**: DuckDuckGo Instant Answer API for movie context
- **Error Handling**: Comprehensive error management for different API scenarios

### Frontend (Vanilla JS/HTML/CSS)
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox
- **Modern UI**: Dark theme with gradient accents and smooth animations
- **Real-time Updates**: Dynamic content loading with loading states
- **Provider Selection**: Radio button interface for AI model selection

### AI Models Used
- **OpenAI GPT-4o (2024-11-20)**: Latest GPT-4o model with enhanced capabilities
- **Claude 3.5 Sonnet (2024-10-22)**: Latest Claude model with improved reasoning

## 🎨 Tech Stack

**Backend:**
- Node.js
- Express.js v5.1.0
- OpenAI SDK v5.23.0
- Anthropic SDK v0.63.1
- Axios v1.12.2
- dotenv v17.2.2

**Frontend:**
- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons

## 🔒 Security Features

- Environment variable management for API keys
- Input validation and sanitization
- Rate limiting awareness
- Error message sanitization
- No sensitive data logging

## 🌟 Advanced Features

### Web Search Enhancement
The application automatically searches for current movie information using DuckDuckGo's API to provide more accurate and contextual recommendations.

### Parallel AI Processing
When "Both AIs" is selected, the application simultaneously queries both OpenAI and Claude APIs for faster results.

### Usage Analytics
Token usage tracking for both AI providers to monitor API consumption.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [DuckDuckGo Instant Answer API](https://duckduckgo.com/api)

## 🙏 Acknowledgments

- OpenAI for providing GPT-4o API
- Anthropic for Claude 3.5 Sonnet API
- DuckDuckGo for free web search API
- Font Awesome for beautiful icons

[![Badge OSC](https://img.shields.io/badge/Evaluate-24243B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8yODIxXzMxNjcyKSIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI3IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGRlZnM%2BCjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yODIxXzMxNjcyIiB4MT0iMTIiIHkxPSIwIiB4Mj0iMTIiIHkyPSIyNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjQzE4M0ZGIi8%2BCjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzREQzlGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM%2BCjwvc3ZnPgo%3D)](https://app.osaas.io/browse/alexbj75-movierecommendator)
