function Arrow({ down = false }: { down?: boolean }) {
  return <span aria-hidden="true" class={down ? 'arrow-mark arrow-down' : 'arrow-mark'} />;
}

function RouteMap() {
  return (
    <figure class="route-map">
      <div aria-hidden="true" class="map-lines">
        <span class="map-entry" />
        <span class="map-branch" />
        <span class="map-exit" />
      </div>
      <span class="map-node map-site">example.com</span>
      <span class="map-node map-robots">robots.txt</span>
      <span class="map-node map-sitemap">sitemap.xml</span>
      <span class="map-node map-urls">Page URLs</span>
      <figcaption class="map-caption">Example route</figcaption>
    </figure>
  );
}

function SitemapTool() {
  return (
    <section id="tool" aria-label="Sitemap tool" tabIndex={-1} class="page-width workbench">
      <form id="discovery-form" class="px-5 py-6 sm:px-8 sm:py-7">
        <label for="website-url" class="mb-2.5 block text-sm font-semibold">
          Website URL
        </label>
        <div class="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input
            id="website-url"
            name="domain"
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            required
            aria-describedby="discovery-status"
            placeholder="https://example.com"
            class="site-input w-full"
          />
          <button id="discover-button" type="submit" disabled class="discover-button">
            <span id="discover-label">Discover sitemaps</span>
            <Arrow />
          </button>
        </div>
        <noscript>
          <p class="mt-3 text-sm text-muted">Enable JavaScript to use the sitemap tool.</p>
        </noscript>
      </form>

      <div class="result-panes grid">
        <section aria-labelledby="sitemaps-heading" class="result-pane sitemap-pane min-w-0">
          <h2 id="sitemaps-heading" class="pane-title">
            Sitemaps
          </h2>
          <p id="discovery-status" role="status" data-state="idle" class="tool-status mt-2">
            Sitemaps will appear here after a search.
          </p>
          <ul id="sitemaps" class="sitemap-list mt-4" hidden />
        </section>
        <section aria-labelledby="urls-heading" class="result-pane extract-pane min-w-0">
          <h2 id="urls-heading" class="pane-title" tabIndex={-1}>
            Extracted URLs
          </h2>
          <p id="extract-status" role="status" class="tool-status mt-2">
            Choose a sitemap to see its page URLs and keywords.
          </p>
          <textarea
            id="urls"
            aria-labelledby="urls-heading"
            aria-describedby="extract-status"
            readOnly
            spellCheck={false}
            rows={6}
            wrap="soft"
            class="extraction-output mt-4 w-full"
            hidden
          />
          <div id="keyword-results" class="mt-5 border-t border-rule pt-4" hidden>
            <h3 id="keywords-heading" class="pane-title">
              Keywords
            </h3>
            <p id="keyword-empty" class="tool-status mt-2" hidden>
              No keywords found in these URL paths.
            </p>
            <textarea
              id="keywords"
              aria-labelledby="keywords-heading"
              readOnly
              spellCheck={false}
              rows={4}
              wrap="soft"
              class="extraction-output mt-3 w-full"
              hidden
            />
          </div>
        </section>
      </div>
    </section>
  );
}

export function Home() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Find a website’s sitemaps and extract page URLs and keywords from their paths."
        />
        <title>Sitemap Discovery</title>
        <link
          rel="preload"
          href="/assets/bricolage-grotesque.woff2"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="/assets/site.css" />
        <script type="module" src="/assets/tool.js"></script>
      </head>
      <body class="bg-paper text-ink antialiased">
        <a href="#tool" class="skip-link">
          Skip to the tool
        </a>
        <header class="masthead bg-violet text-white">
          <div class="page-width flex min-h-16 items-center justify-between gap-4 sm:min-h-[4.25rem]">
            <span class="wordmark flex items-center gap-2.5 font-semibold">
              <span aria-hidden="true" class="brand-mark">
                <i />
                <i />
                <i />
              </span>
              Sitemap Discovery
            </span>
            <a href="#how-it-works" class="how-link inline-flex items-center gap-2">
              How it works <Arrow down />
            </a>
          </div>
        </header>

        <main>
          <section aria-labelledby="hero-heading" class="bg-violet text-white">
            <div class="page-width hero-grid">
              <div>
                <h1 id="hero-heading" class="hero-title font-display font-bold">
                  <span class="block">Find the map.</span>{' '}
                  <span class="block text-gold">Get the URLs.</span>
                </h1>
                <p class="hero-copy mt-5">
                  Find a website’s sitemaps, then extract page URLs and keywords from those URLs.
                </p>
              </div>
              <RouteMap />
            </div>
          </section>

          <SitemapTool />

          <section id="how-it-works" aria-labelledby="how-heading" class="page-width how-section">
            <h2 id="how-heading" class="how-title font-display font-bold">
              How it works
            </h2>
            <div class="how-steps grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <div>
                <h3 class="text-base font-semibold">Find the sitemaps</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-muted">
                  Discovery reads <code>robots.txt</code> and checks common paths like{' '}
                  <code>sitemap.xml</code>.
                </p>
              </div>
              <div>
                <h3 class="text-base font-semibold">Read the sitemap</h3>
                <p class="mt-1.5 text-sm leading-relaxed text-muted">
                  An XML sitemap lists page URLs. The tool turns URL paths into keywords. If you
                  find an index, open one of its child sitemaps.
                </p>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
