# SEO Sitemap Discovery

A high-performance SEO utility for automated sitemap discovery and URL-based keyword extraction.

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.1-blue.svg" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18.0.0-339933.svg" />
  <img src="https://img.shields.io/badge/TypeScript-6.x-3178C6.svg" />
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-yellow.svg" target="_blank" />
  </a>
</p>

## Description

SEO Sitemap Discovery is a specialized Node.js application designed to streamline technical SEO workflows. It solves the challenge of locating hidden sitemaps across complex domains and programmatically extracting meaningful keywords from URL structures. By automating the discovery process and parsing XML data into structured formats, it provides SEO professionals and developers with a robust tool for site auditing, competitor analysis, and content strategy mapping.

## Features

- **Automated Sitemap Discovery** - Intelligently identifies sitemap locations using common patterns and robots.txt analysis
- **URL Keyword Extraction** - Parses XML sitemaps to extract and normalize keywords directly from URL paths
- **Flexible Output Formats** - Supports both structured JSON for programmatic use and plain text for quick analysis
- **Sitemap Index Support** - Recursively processes sitemap indices to ensure comprehensive data extraction
- **High Performance** - Built with an asynchronous architecture to handle large-scale sitemaps efficiently
- **Robust Validation** - Ensures data integrity through strict Zod-based request schema validation
- **Enterprise Logging** - Comprehensive error tracking and operational insights powered by Winston

## Tech Stack

- **Backend Runtime**: Node.js (v20+)
- **Language**: TypeScript 6
- **Web Framework**: Express.js 5
- **HTTP Client**: Axios
- **Data Validation**: Zod
- **XML Parsing**: XML2JS
- **Logging**: Winston
- **Development Tools**: TSX, ESLint, Prettier

## Installation Guide

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Steps

1. Clone the repository to your local machine
2. Install the required dependencies

```bash
npm install
```

3. Configure the environment variables

```bash
cp .env.example .env
```

4. Configure your preferred port in the `.env` file (defaults to 3003)
5. Build the project

```bash
npm run build
```

6. Start the application

```bash
npm start
```

For development with hot-reloading:

```bash
npm run dev
```

## Configuration

The application uses environment variables for configuration. These are managed via a `.env` file in the root directory.

| Variable   | Description                                      | Default      |
| ---------- | ------------------------------------------------ | ------------ |
| `PORT`     | The port on which the API server will run        | `3003`       |
| `NODE_ENV` | The environment mode (development or production) | `production` |

## Usage

The application provides a RESTful API for sitemap operations. All endpoints expect and return JSON by default.

### 1. Discover Sitemaps

Search for sitemaps associated with a specific domain.

- **Endpoint**: `POST /sitemap/discovery`
- **Body**:

```json
{
  "domain": "example.com"
}
```

- **Sample Request**:

```bash
curl -X POST http://localhost:3003/sitemap/discovery \
     -H "Content-Type: application/json" \
     -d '{"domain": "google.com"}'
```

### 2. Extract Keywords

Parse a specific sitemap URL to extract URLs and keywords.

- **Endpoint**: `POST /sitemap/extract`
- **Body**:

```json
{
  "sitemapUrl": "https://example.com/sitemap.xml",
  "format": "json"
}
```

- **Sample Request**:

```bash
curl -X POST http://localhost:3003/sitemap/extract \
     -H "Content-Type: application/json" \
     -d '{"sitemapUrl": "https://example.com/sitemap.xml", "format": "json"}'
```

## Project Structure

```text
/
├── src/
│   ├── controllers/      # Request handlers and response logic
│   ├── routes/           # API endpoint definitions
│   ├── services/         # Core business logic for discovery and extraction
│   ├── schemas/          # Zod validation schemas for requests
│   ├── middleware/       # Custom Express middleware (validation, error handling)
│   ├── utils/            # Shared utilities and logger configuration
│   ├── types/            # TypeScript interface and type definitions
│   ├── config/           # Application configuration management
│   ├── app.ts            # Express application setup
│   └── index.ts          # Server entry point
├── dist/                 # Compiled JavaScript files
└── tsconfig.json         # TypeScript configuration
```

## Scripts / Commands

| Command            | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `npm run dev`      | Starts the development server with hot-reloading using tsx  |
| `npm run build`    | Compiles the TypeScript source code into the dist directory |
| `npm start`        | Runs the compiled production build                          |
| `npm run format`   | Formats the codebase using Prettier                         |
| `npm run lint`     | Analyzes code for potential errors and styling issues       |
| `npm run lint:fix` | Automatically fixes linting errors where possible           |

## Contributing

Contributions are welcome to improve the discovery algorithms or extraction logic.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add some improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for detailed terms and conditions.

## Author

Reynaldi Arya
