# SEO Sitemap Discovery

A high-performance SEO utility for automated sitemap discovery and URL-based keyword extraction.

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.0-blue.svg" />
  <img src="https://img.shields.io/badge/Node.js-%3E%3D22.0.0-339933.svg" />
  <img src="https://img.shields.io/badge/TypeScript-6.x-3178C6.svg" />
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-yellow.svg" target="_blank" />
  </a>
</p>

## Description

SEO Sitemap Discovery is a specialized Node.js application designed to streamline technical SEO workflows. It solves the challenge of locating hidden sitemaps across complex domains and programmatically extracting meaningful keywords from URL structures. By automating the discovery process and parsing XML data into structured formats, it provides SEO professionals and developers with a robust tool for site auditing, competitor analysis, and content strategy mapping.

## Features

- **Automated Sitemap Discovery** - Reads `robots.txt` and checks common sitemap paths.
- **URL and Keyword Extraction** - Lists page URLs and derives keyword phrases from their paths.
- **Flexible Output Formats** - Returns a JSON keyword summary, plain-text keywords, or page URLs and keywords together.
- **Sitemap Index Support** - Lets you choose child sitemaps from an index.
- **Browser Tool** - Runs discovery and extraction on the same Hono app as the API.
- **Request Validation** - Validates API requests with Zod.
- **Logging** - Records errors and diagnostics with Winston.

## Tech Stack

- **Backend Runtime** - Node.js 24
- **Language** - TypeScript 6
- **Web Framework** - Hono with `@hono/node-server`
- **Frontend** - Hono JSX and Tailwind CSS
- **HTTP Client** - Axios
- **Data Validation** - Zod
- **XML Parsing** - XML2JS
- **Logging** - Winston
- **Development Tools** - tsx, esbuild, ESLint, and Prettier

## Installation Guide

### Prerequisites

- Node.js 22.x or higher
- npm 10.x or higher

### Steps

1. Clone the repository and open its root directory.
2. Install the locked dependencies, copy the environment template, and start the development server.

   ```bash
   npm ci
   cp .env.example .env
   npm run dev
   ```

   In PowerShell, use `Copy-Item .env.example .env` for the copy step.

3. Open [http://localhost:3000](http://localhost:3000).

To run the local production build, use these commands.

```bash
npm run build
npm start
```

## Configuration

The local server reads `.env` from the repository root. Copy `.env.example` to customize these settings.

| Variable   | Description                                                          | Template value |
| ---------- | -------------------------------------------------------------------- | -------------- |
| `PORT`     | Local port for the browser tool and API. It defaults to `3000`.      | `3000`         |
| `NODE_ENV` | Set to `development` for detailed logs and local API error messages. | `production`   |

## Usage

In the browser, enter a website URL or domain and select **Discover sitemaps**. Choose a sitemap to view its page URLs and keywords. If you choose an index, its child sitemaps appear in the list.

The browser calls the same two API routes. Send API requests with `Content-Type: application/json`.

### 1. Discover Sitemaps

`POST /sitemap/discovery` accepts a domain or website URL in `domain` and returns `domain`, `sitemaps`, and `checkedPaths`.

```bash
curl -X POST http://localhost:3000/sitemap/discovery \
     -H "Content-Type: application/json" \
     -d '{"domain": "example.com"}'
```

### 2. Extract URLs and Keywords

`POST /sitemap/extract` accepts `sitemapUrl` and an optional `format`. The default JSON response includes URL and keyword counts and the `keywordLists` array. Use `format: "text"` for one keyword phrase per line.

Replace the example sitemap URL with one returned by discovery.

```bash
curl -X POST http://localhost:3000/sitemap/extract \
     -H "Content-Type: application/json" \
     -d '{"sitemapUrl": "https://example.com/sitemap.xml", "format": "json"}'
```

For `urls` and `keywordLists` in one JSON response, add `Accept: application/vnd.sitemap-discovery.urls+json` as the browser does. A `format` of `text` takes priority over this header.

An index returns `type: "sitemapindex"` and its immediate child URLs in `sitemaps`. Submit a child URL to the same route to inspect that file.

## Project Structure

```text
/
├── src/
│   ├── controllers/      # Request handlers and response logic
│   ├── routes/           # API endpoint definitions
│   ├── services/         # Core business logic for discovery and extraction
│   ├── schemas/          # Zod validation schemas for requests
│   ├── middleware/       # Hono JSON parsing, validation, and error handling
│   ├── utils/            # Shared utilities and logger configuration
│   ├── types/            # TypeScript interface and type definitions
│   ├── config/           # Application configuration management
│   ├── web/              # Hono JSX, Tailwind, and the browser client
│   ├── app.ts            # Fetch-compatible Hono app
│   └── index.ts          # Local Node server and static file serving
├── public/assets/        # Generated stylesheet and browser bundle
├── dist/                 # Compiled server code
├── .env.example          # Local environment template
└── tsconfig.json         # TypeScript configuration
```

## Scripts / Commands

| Command                | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Starts the server and watches server and browser files. |
| `npm run build`        | Compiles the server and generates browser assets.       |
| `npm run build:assets` | Builds the stylesheet and browser bundle.               |
| `npm start`            | Starts the compiled production server.                  |
| `npm run typecheck`    | Checks TypeScript without emitting files.               |
| `npm run format`       | Formats the codebase using Prettier.                    |
| `npm run lint`         | Checks the codebase with ESLint.                        |
| `npm run lint:fix`     | Applies available ESLint fixes.                         |

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