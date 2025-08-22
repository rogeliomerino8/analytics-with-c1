<picture>
  <source media="(prefers-color-scheme: light)" srcset="public/page-title.svg" />
  <source media="(prefers-color-scheme: dark)" srcset="public/page-title.svg" />
  <img alt="Analytics with C1" src="public/page-title.svg" />
</picture>

## Introduction

Experience the power of intelligent financial analytics through [Thesys](https://www.thesys.dev/), where large language models and generative UI combine to create dynamic, context-aware analytics dashboards. From automatically generated financial visualizations and interactive charts to real-time market data and adaptive layouts, this demo showcases how generative UI transforms traditional analytics into an intelligent, visual, and highly engaging interface that understands and responds to your unique analytical queries.

## Demo

[![Built with Thesys](https://thesys.dev/built-with-thesys-badge.svg)](https://thesys.dev)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-analytics--with--c1.vercel.app-blue?style=for-the-badge&logo=vercel&logo=link)](https://analytics-with-c1.vercel.app/)

## Overview

This project reimagines what financial analytics could be if combined with Thesys GenUI:

1. **Comprehensive Financial Data** - Access real-time and historical stock prices, cryptocurrency data, income statements, balance sheets, and cash flow statements
2. **Advanced LLM Analysis** - Uses AI to analyze financial data, identify trends, and provide contextual insights with market context from web search
3. **Generative UI Dashboards** - Dynamic charts, graphs, and analytics components created on-the-fly based on your queries using C1
4. **Interactive Visualizations** - A responsive interface that adapts to different types of financial analysis requests

Unlike traditional analytics platforms that show static charts or AI platforms that generate plain text, this project creates rich, visual, and interactive financial dashboards tailored to each analytical query.

## Tech Stack

- **Frontend**: Next.js 15 with App Router
- **UI**: Tailwind CSS, SASS, and Thesys GenUI SDK
- **AI Integration**: Thesys C1 SDK, Anthropic Claude
- **Financial APIs**: Financial Datasets API for stocks/crypto, Exa API for web search
- **Streaming**: Real-time response streaming using Server-Sent Events

## Features

### Financial Analytics Tools
- **Stock Analysis**: Current prices, historical charts, and trend analysis
- **Cryptocurrency Data**: Real-time crypto prices and historical performance
- **Company Financials**: Income statements, balance sheets, and cash flow analysis
- **Market News**: Latest company news and market insights
- **Web Context**: Real-time web search to provide market context and explanations

### Generative UI Components
- Dynamic charts and visualizations based on data type
- Interactive financial dashboards
- Contextual analysis with market insights
- Responsive layouts that adapt to query complexity

## Getting Started

### Prerequisites

- Node.js (v20+)
- NPM
- API keys for required services

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/thesysdev/analytics-with-c1.git
   cd analytics-with-c1
   ```

2. Install dependencies:

   ```bash
   npm i
   ```

3. Set up environment variables by creating a `.env` file:

   ```bash
   touch .env
   ```

4. Add your API keys to the `.env` file:

   ```
   THESYS_API_KEY=[your_thesys_api_key]
   FINANCIAL_DATASETS_API_KEY=[your_financial_datasets_api_key]
   EXA_API_KEY=[your_exa_api_key]
   ANTHROPIC_KEY=[your_anthropic_api_key]
   ```

   **API Key Sources:**
   - **Thesys API Key**: Generate at [Thesys Console](https://chat.thesys.dev/console/keys)
   - **Financial Datasets API**: Get your key at [Financial Datasets](https://financialdatasets.ai/) for stock and crypto data
   - **Exa API**: Sign up at [Exa](https://exa.ai/) for web search capabilities
   - **Anthropic API**: Get your key at [Anthropic Console](https://console.anthropic.com/) for related queries

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. User enters a financial analysis query
2. The application sends the query to the Thesys C1 API
3. C1 utilizes financial tools to fetch relevant market data, company financials, and news
4. Web search provides additional market context and explanations
5. C1 generates a dynamic analytics dashboard with appropriate visualizations
6. The response is streamed back to the client for a smooth user experience

## Example Queries

Try asking questions like:
- "Show me Apple's stock performance over the last year"
- "Compare Tesla and Ford's financial health"
- "What's happening with Bitcoin today?"
- "Analyze Microsoft's cash flow trends"
- "Show me the top performing tech stocks this quarter"

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Thesys](https://www.thesys.dev/) - Build GenUI Apps
- [C1 Documentation](https://docs.thesys.dev/welcome) - Learn how to use C1 and build AI apps
- [Example Apps](https://github.com/thesysdev/examples/tree/main) - Clone and explore more C1 example projects
- [Financial Datasets](https://financialdatasets.ai/) for comprehensive financial data APIs
- [Exa](https://exa.ai/) for intelligent web search capabilities
- [Next.js](https://nextjs.org/) for the React framework
