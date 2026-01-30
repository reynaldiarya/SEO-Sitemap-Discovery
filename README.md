<div align="center">

# 🗺️ SEO Sitemap Discovery

**A TypeScript API for discovering sitemaps and extracting keywords from any website**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2-lightgrey.svg)](https://expressjs.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

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
- [License](#-license)

---

## 🌟 Overview

**SEO Sitemap Discovery** is a TypeScript-based Node.js API designed to help SEO professionals and developers discover sitemaps from any website and extract keywords from sitemap URLs. Similar to tools like [seomator.com/sitemap-finder](https://seomator.com/sitemap-finder), this application provides automated sitemap discovery and keyword extraction capabilities.

### Key Capabilities

- 🔍 **Automatic Sitemap Discovery**: Finds sitemaps by checking robots.txt and common paths
- 📝 **Keyword Extraction**: Extracts keywords from URL slugs in sitemaps
- 🔄 **Sitemap Index Support**: Handles both standard sitemaps and sitemap indexes
- ⚡ **Fast & Efficient**: Concurrent checking of multiple sitemap paths

---

## ✨ Features

### Core Capabilities

- **🔍 Sitemap Discovery**:
  - Parses `robots.txt` for sitemap declarations
  - Checks common sitemap paths: `/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml`, etc.
  - Supports subdirectory scanning (e.g., `example.com/blog/sitemap.xml`)
  - Reports checked paths with HTTP status codes

- **📝 Keyword Extraction**:
  - Extracts keywords from URL slugs in sitemaps
  - Counts keyword frequency across all URLs
  - Sorts keywords by occurrence count
  - Supports JSON and plain text output formats

- **🔄 Sitemap Index Handling**:
  - Detects sitemap index files automatically
  - Returns list of child sitemaps for further processing

---

## 📋 Prerequisites

| Requirement         | Version  | Required |
| ------------------- | -------- | -------- |
| **Node.js**         | ≥ 18.0.0 | ✅ Yes   |
| **npm** or **yarn** | Latest   | ✅ Yes   |

---

## 🚀 Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/reynaldiarya/SEO-Sitemap-Discovery.git
cd SEO-Sitemap-Discovery
```

### 2️⃣ Install Dependencies

```bash
npm install
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
```

### Configuration Options

| Variable   | Description        | Default       | Required |
| ---------- | ------------------ | ------------- | -------- |
| `PORT`     | Server port number | `3003`        | No       |
| `NODE_ENV` | Environment mode   | `development` | No       |

---

## 🎯 Usage

### Development Mode

Run the application with hot-reloading:

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

### Base URL

```
http://localhost:3003/sitemap
```

---

### 1. Discover Sitemaps

Automatically discover all sitemaps for a given domain.

#### Request

```http
POST /sitemap/discovery
Content-Type: application/json
```

#### Request Body

```json
{
  "domain": "example.com"
}
```

#### Parameters

| Parameter | Type   | Description           | Required |
| --------- | ------ | --------------------- | -------- |
| `domain`  | string | Target domain to scan | Yes      |

#### Response

```json
{
  "domain": "https://example.com",
  "sitemaps": ["https://example.com/sitemap.xml", "https://example.com/sitemap_index.xml"],
  "checkedPaths": [
    {
      "url": "https://example.com/robots.txt",
      "found": true,
      "status": 200
    },
    {
      "url": "https://example.com/sitemap.xml",
      "found": true,
      "status": 200
    }
  ]
}
```

#### Example Usage

**cURL:**

```bash
curl -X POST http://localhost:3003/sitemap/discovery \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com"}'
```

---

### 2. Extract Keywords from Sitemap

Extract keywords from URL slugs in a sitemap XML file.

#### Request

```http
POST /sitemap
Content-Type: application/json
```

#### Request Body

```json
{
  "sitemapUrl": "https://example.com/sitemap.xml",
  "format": "json"
}
```

#### Parameters

| Parameter    | Type   | Description                   | Required | Default |
| ------------ | ------ | ----------------------------- | -------- | ------- |
| `sitemapUrl` | string | URL of the sitemap XML        | Yes      | -       |
| `format`     | string | Output format: `json`, `text` | No       | `json`  |

#### Response (Standard Sitemap)

```json
{
  "type": "extraction",
  "totalUrls": 150,
  "extractedKeywords": 120,
  "ignoredUrls": 30,
  "keywordLists": ["seo tools", "keyword research", "sitemap generator"]
}
```

#### Response (Sitemap Index)

```json
{
  "message": "This is a sitemap index.",
  "type": "sitemapindex",
  "sitemaps": ["https://example.com/sitemap-posts.xml", "https://example.com/sitemap-pages.xml"]
}
```

#### Example Usage

**cURL (JSON output):**

```bash
curl -X POST http://localhost:3003/sitemap \
  -H "Content-Type: application/json" \
  -d '{"sitemapUrl": "https://example.com/sitemap.xml"}'
```

**cURL (Plain text output):**

```bash
curl -X POST http://localhost:3003/sitemap \
  -H "Content-Type: application/json" \
  -d '{"sitemapUrl": "https://example.com/sitemap.xml", "format": "text"}'
```

---

## 🏗️ Architecture

### Project Structure

```
SEO-Sitemap-Discovery/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── sitemapController.ts
│   │   └── sitemapDiscoveryController.ts
│   ├── services/             # Business logic
│   │   ├── sitemapService.ts
│   │   └── sitemapDiscoveryService.ts
│   ├── routes/               # API routes
│   │   └── sitemapRoutes.ts
│   ├── types/                # TypeScript type definitions
│   │   └── sitemapTypes.ts
│   ├── middleware/           # Express middleware
│   ├── utils/                # Utility functions
│   ├── config/               # Configuration
│   ├── app.ts                # Express app setup
│   └── index.ts              # Application entry point
├── dist/                     # Compiled JavaScript (generated)
├── .env                      # Environment variables (gitignored)
├── .env.example              # Environment template
├── tsconfig.json             # TypeScript configuration
├── package.json              # Project dependencies
└── README.md                 # This file
```

### Design Patterns

- **Service Layer Pattern**: Business logic separated from controllers
- **Dependency Injection**: Services are injected into controllers
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

### Data Processing

| Technology  | Version | Purpose      |
| ----------- | ------- | ------------ |
| **Axios**   | 1.13.2  | HTTP client  |
| **xml2js**  | 0.6.2   | XML parsing  |
| **Cheerio** | 1.2.0   | HTML parsing |

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
| **Prettier** | 3.8.0   | Code formatting      |
| **tsx**      | 4.21.0  | TypeScript execution |

---

## 👨‍💻 Development

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run linting**: `npm run lint`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript strict mode** for type safety

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact & Support

- **GitHub**: [@reynaldiarya](https://github.com/reynaldiarya)
- **Issues**: [Report a bug](https://github.com/reynaldiarya/SEO-Sitemap-Discovery/issues)

---

<div align="center">

**Built with ❤️ using TypeScript and Node.js**

If this project helped you, consider giving it a ⭐!

</div>
