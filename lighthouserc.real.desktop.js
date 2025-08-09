
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000','http://localhost:3000/cart'/*,'http://localhost:3000/collections'*/],
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready',
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        throttlingMethod: 'simulate',
        formFactor: 'desktop',
        screenEmulation: { mobile: false, width: 1366, height: 768, deviceScaleFactor: 1, disabled: false },
        throttling: {
          rttMs: 50,
          throughputKbps: 20000,
          cpuSlowdownMultiplier: 1.5
        },
        onlyCategories: ['performance','accessibility','seo','best-practices'],
        budgets: [{
          path: '/*',
          resourceSizes: [
            { resourceType: 'script',     budget: 190 },
            { resourceType: 'image',      budget: 75  },
            { resourceType: 'stylesheet', budget: 20  },
            { resourceType: 'font',       budget: 100 },
            { resourceType: 'total',      budget: 320 }
          ],
          resourceCounts: [
            { resourceType: 'script',     budget: 15 },
            { resourceType: 'image',      budget: 20 },
            { resourceType: 'stylesheet', budget: 5  },
            { resourceType: 'third-party',budget: 10 }
          ]
        }]
      }
    },
    assert: {
      assertions: {
        'categories:performance':    ['warn',  { minScore: 0.90 }],
        'categories:seo':            ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],

        'first-contentful-paint':    ['warn',  { maxNumericValue: 1400 }],
        'largest-contentful-paint':  ['warn',  { maxNumericValue: 2200 }],
        'interactive':               ['warn',  { maxNumericValue: 3000 }],
        'total-blocking-time':       ['warn',  { maxNumericValue: 150 }],
        'speed-index':               ['warn',  { maxNumericValue: 2600 }],
        'cumulative-layout-shift':   ['error', { maxNumericValue: 0.10 }],

        'color-contrast': ['warn', { minScore: 0.9 }],
        'document-title': ['error', { minScore: 1 }],
        'html-has-lang':  ['error', { minScore: 1 }],
        'meta-viewport':  ['error', { minScore: 1 }]
      }
    },
    upload: { target: 'temporary-public-storage' }
  }
}