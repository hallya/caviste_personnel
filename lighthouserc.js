module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/cart'
      ],
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready',
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        throttlingMethod: 'devtools',
        throttling: {
          rttMs: 0,
          throughputKbps: 0,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0
        },
        onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
        budgets: [
          {
            path: '/*',
            resourceSizes: [
              { resourceType: 'script', budget: 190 },
              { resourceType: 'image', budget: 75 },
              { resourceType: 'stylesheet', budget: 20 },
              { resourceType: 'font', budget: 100 },
              { resourceType: 'total', budget: 320 }
            ],
            resourceCounts: [
              { resourceType: 'script', budget: 15 },
              { resourceType: 'image', budget: 20 },
              { resourceType: 'stylesheet', budget: 5 },
              { resourceType: 'third-party', budget: 10 }
            ]
          }
        ]
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        
        'first-contentful-paint': ['error', { maxNumericValue: 65 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 65 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.05 }],
        'interactive': ['error', { maxNumericValue: 65 }],
        
        'color-contrast': ['warn', { minScore: 0.9 }],   // Plus permissif car peut retourner NaN
        'document-title': ['error', { minScore: 1 }],
        'html-has-lang': ['error', { minScore: 1 }],
        'meta-viewport': ['error', { minScore: 1 }],
        
        'total-blocking-time': ['error', { maxNumericValue: 30 }],
        'speed-index': ['error', { maxNumericValue: 140 }],
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};