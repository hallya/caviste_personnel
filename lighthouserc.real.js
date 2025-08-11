module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000",
        "http://localhost:3000/cart" /*,'http://localhost:3000/collections'*/,
      ],
      numberOfRuns: 3,
      startServerCommand: "npm run start",
      startServerReadyPattern: "ready",
      settings: {
        chromeFlags: "--no-sandbox --headless --disable-gpu",
        throttlingMethod: "simulate",
        formFactor: "mobile",
        screenEmulation: {
          mobile: true,
          width: 360,
          height: 640,
          deviceScaleFactor: 2,
          disabled: false,
        },
        throttling: {
          rttMs: 300,
          throughputKbps: 750,
          cpuSlowdownMultiplier: 6,
        },
        onlyCategories: [
          "performance",
          "accessibility",
          "seo",
          "best-practices",
        ],
        budgets: [
          {
            path: "/*",
            resourceSizes: [
              { resourceType: "script", budget: 190 },
              { resourceType: "image", budget: 150 },
              { resourceType: "stylesheet", budget: 20 },
              { resourceType: "font", budget: 120 },
              { resourceType: "total", budget: 420 },
            ],
            resourceCounts: [
              { resourceType: "script", budget: 15 },
              { resourceType: "image", budget: 24 },
              { resourceType: "stylesheet", budget: 6 },
              { resourceType: "third-party", budget: 10 },
            ],
          },
        ],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.6 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],

        "first-contentful-paint": ["warn", { maxNumericValue: 3500 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 4500 }],
        interactive: ["warn", { maxNumericValue: 8000 }],
        "total-blocking-time": ["warn", { maxNumericValue: 600 }],
        "speed-index": ["warn", { maxNumericValue: 6000 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],

        "color-contrast": ["warn", { minScore: 0.9 }],  // Plus permissif car peut retourner NaN
        "document-title": ["error", { minScore: 1 }],
        "html-has-lang": ["error", { minScore: 1 }],
        "meta-viewport": ["error", { minScore: 1 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
