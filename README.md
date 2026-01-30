<div align="center">

# 🎯 Keyword Rank Tracker

**A powerful, enterprise-grade TypeScript application for tracking keyword search engine rankings on Google**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2-lightgrey.svg)](https://expressjs.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Keyword Rank Tracker** is a robust TypeScript-based Node.js application designed to track keyword search engine rankings on Google (Indonesia region). Built with scalability and performance in mind, it supports multiple scraping strategies to ensure reliable and efficient rank tracking.

### Why Use This Tool?

- 🚀 **Multiple Scraping Methods**: Choose between Puppeteer, Scraping Robot API, or Serper.dev based on your needs
- 💪 **Production-Ready**: Built with TypeScript for type safety and maintainability
- ⚡ **Performance Optimized**: Single browser instance reuse, efficient pagination handling
- 🔒 **Secure**: Environment-based configuration with API key protection
- 📊 **Comprehensive Logging**: Winston-powered logging for debugging and monitoring

---

## ✨ Features

### Core Capabilities

- **🎯 Keyword Rank Tracking**: Accurately tracks keyword positions on Google Search (Indonesia region)
- **📦 Batch Processing**: Efficiently handles multiple keywords in a single request
- **📄 Pagination Support**: Checks rankings across multiple search result pages
- **🔄 Multiple Scraper Strategies**:
  - **Puppeteer**: Headless browser scraping with local or remote Chrome instances
  - **Scraping Robot**: API-based scraping with proxy rotation for enhanced reliability
  - **Serper.dev**: Fast and reliable Google Search API integration
- **⚙️ Flexible Configuration**: Extensive customization through environment variables
- **📝 Request Validation**: Zod-powered schema validation for API requests
- **🪵 Advanced Logging**: Winston logger with multiple log levels and formats

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement                | Version  | Required      |
| -------------------------- | -------- | ------------- |
| **Node.js**                | ≥ 18.0.0 | ✅ Yes        |
| **npm** or **yarn**        | Latest   | ✅ Yes        |
| **Scraping Robot API Key** | -        | ⚠️ Optional\* |
| **Serper.dev API Key**     | -        | ⚠️ Optional\* |

> **\*Note**: API keys are only required if you choose to use the respective scraper. The Puppeteer scraper works without any API keys.

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/reynaldiarya/Keyword-Rank-Tracker.git
cd Keyword-Rank-Tracker
```

### 2️⃣ Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3️⃣ Verify Installation

```bash
npm run lint
```

---

## ⚙️ Configuration

### Environment Variables

1. **Create your `.env` file:**

```bash
cp .env.example .env
```

2. **Configure the following variables:**

```env
# Server Configuration
PORT=3003
NODE_ENV=development

# Scraping Robot API (Optional)
# Required only if using 'scrapingRobot' scraper
SCRAPING_ROBOT_API_KEY=your_scraping_robot_api_key_here

# Serper.dev API (Optional)
# Required only if using 'serperDev' scraper
SERPER_DEV_API_KEY=your_serper_dev_api_key_here

# Puppeteer Configuration (Optional)
# Leave empty to use local headless Chrome
# Or set a WebSocket endpoint (e.g., browserless.io) for remote browser
BROWSER_WS_ENDPOINT=

# Puppeteer Customization (Optional)
PUPPETEER_USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
PUPPETEER_COOKIE=
```

### Configuration Options

| Variable                 | Description             | Default       | Required |
| ------------------------ | ----------------------- | ------------- | -------- |
| `PORT`                   | Server port number      | `3003`        | Yes      |
| `NODE_ENV`               | Environment mode        | `development` | Yes      |
| `SCRAPING_ROBOT_API_KEY` | Scraping Robot API key  | -             | No       |
| `SERPER_DEV_API_KEY`     | Serper.dev API key      | -             | No       |
| `BROWSER_WS_ENDPOINT`    | Remote browser endpoint | -             | No       |
| `PUPPETEER_USER_AGENT`   | Custom user agent       | -             | No       |
| `PUPPETEER_COOKIE`       | Custom cookies          | -             | No       |

---

## 🎯 Usage

### Development Mode

Run the application with hot-reloading for development:

```bash
npm run dev
```

The server will start at `http://localhost:3003` (or your configured port).

### Production Mode

Build and run the application for production:

```bash
# Build the TypeScript project
npm run build

# Start the production server
npm start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

---

## 📖 API Documentation

### Check Keyword Rankings

Track keyword rankings for a specific website.

#### Request

```http
GET /keyword-ranking
Content-Type: application/json
```

#### Request Body

```json
{
  "website": "example.com",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "page": 1,
  "scraper": "serperDev"
}
```

#### Parameters

| Parameter  | Type     | Description                                                      | Required | Default           |
| ---------- | -------- | ---------------------------------------------------------------- | -------- | ----------------- |
| `website`  | string   | Target website domain                                            | Yes      | -                 |
| `keywords` | string[] | Array of keywords to track                                       | Yes      | -                 |
| `page`     | number   | Google search page number                                        | No       | `1`               |
| `scraper`  | string   | Scraper type: `"puppeteer"`, `"scrapingRobot"`, or `"serperDev"` | No       | `"scrapingRobot"` |

#### Response

```json
{
  "success": true,
  "data": {
    "website": "example.com",
    "results": [
      {
        "keyword": "keyword1",
        "rank": 3,
        "url": "https://example.com/page1",
        "found": true
      },
      {
        "keyword": "keyword2",
        "rank": null,
        "url": null,
        "found": false
      }
    ]
  }
}
```

#### Example Usage

**cURL:**

```bash
curl -X GET http://localhost:3003/keyword-ranking \
  -H "Content-Type: application/json" \
  -d '{
    "website": "example.com",
    "keywords": ["seo tools", "rank tracker"],
    "page": 1,
    "scraper": "serperDev"
  }'
```

**JavaScript (Fetch):**

```javascript
const response = await fetch('http://localhost:3003/keyword-ranking', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    website: 'example.com',
    keywords: ['seo tools', 'rank tracker'],
    page: 1,
    scraper: 'serperDev',
  }),
});

const data = await response.json();
console.log(data);
```

> ⚠️ **Important**: This endpoint uses a `GET` request with a JSON body. Ensure your HTTP client (Postman, Insomnia, etc.) supports this configuration.

---

## 🏗️ Architecture

### Project Structure

```
Keyword-Rank-Tracker/
├── src/
│   ├── controllers/          # Request handlers
│   ├── services/             # Business logic
│   ├── scrapers/             # Scraper implementations
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   └── index.ts              # Application entry point
├── dist/                     # Compiled JavaScript (generated)
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

### Design Patterns

- **Strategy Pattern**: Used for scraper selection (Puppeteer, Scraping Robot, Serper.dev)
- **Dependency Injection**: Services are injected into controllers for better testability
- **Single Responsibility**: Each module handles one specific concern
- **Type Safety**: Full TypeScript implementation with strict typing

---

## 🛠️ Tech Stack

### Core Technologies

| Technology     | Version | Purpose               |
| -------------- | ------- | --------------------- |
| **Node.js**    | ≥18.0.0 | Runtime environment   |
| **TypeScript** | 5.9.3   | Type-safe development |
| **Express.js** | 5.2.1   | Web framework         |

### Scraping & Data Processing

| Technology          | Version | Purpose                     |
| ------------------- | ------- | --------------------------- |
| **Puppeteer**       | 24.36.1 | Headless browser automation |
| **Puppeteer Extra** | 3.3.6   | Puppeteer plugins           |
| **Stealth Plugin**  | 2.11.2  | Anti-bot detection          |
| **Cheerio**         | 1.2.0   | HTML parsing                |
| **Axios**           | 1.13.4  | HTTP client                 |

### Utilities

| Technology  | Version | Purpose                |
| ----------- | ------- | ---------------------- |
| **Winston** | 3.19.0  | Logging                |
| **Zod**     | 4.3.6   | Schema validation      |
| **dotenv**  | 17.2.3  | Environment management |

### Development Tools

| Technology   | Version | Purpose              |
| ------------ | ------- | -------------------- |
| **ESLint**   | 9.39.2  | Code linting         |
| **Prettier** | 3.8.1   | Code formatting      |
| **tsx**      | 4.21.0  | TypeScript execution |

---

## 👨‍💻 Development

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests and linting**: `npm run lint`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript strict mode** for type safety

### Best Practices

- ✅ Write type-safe code with TypeScript
- ✅ Follow the existing code structure
- ✅ Add comments for complex logic
- ✅ Keep functions small and focused
- ✅ Use meaningful variable names
- ✅ Validate all inputs with Zod schemas

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: "Browser not found" error with Puppeteer

**Solution**: Install Chromium manually:

```bash
npx puppeteer browsers install chrome
```

#### Issue: API returning 401 Unauthorized

**Solution**: Verify your API keys in `.env`:

```bash
# Check if API keys are set correctly
cat .env | grep API_KEY
```

#### Issue: Connection timeout

**Solution**:

- Check your internet connection
- If using remote browser (`BROWSER_WS_ENDPOINT`), verify the endpoint is accessible
- Increase timeout values in scraper configuration

#### Issue: Rankings not matching manual search

**Solution**:

- Google results are personalized; rankings may vary
- Consider clearing cookies or using incognito mode
- Verify you're targeting the correct Google region (Indonesia)

### Debug Mode

Enable detailed logging by setting:

```env
NODE_ENV=development
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Add tests for new features (when applicable)
- Keep pull requests focused on a single feature/fix

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact & Support

- **GitHub**: [@reynaldiarya](https://github.com/reynaldiarya)
- **Issues**: [Report a bug](https://github.com/reynaldiarya/Keyword-Rank-Tracker/issues)

---

<div align="center">

**Built with ❤️ using TypeScript and Node.js**

If this project helped you, consider giving it a ⭐!

</div>
