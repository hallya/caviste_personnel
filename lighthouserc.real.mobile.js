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
          width: 390,
          height: 844,
          deviceScaleFactor: 3,
          disabled: false,
        },
        throttling: {
          rttMs: 150,
          throughputKbps: 1600,
          cpuSlowdownMultiplier: 4,
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
        "categories:performance": ["warn", { minScore: 0.75 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],

        // ms (réalistes mobile)
        "first-contentful-paint": ["warn", { maxNumericValue: 2200 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 3000 }],
        interactive: ["warn", { maxNumericValue: 5000 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "speed-index": ["warn", { maxNumericValue: 3800 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],

        "color-contrast": ["warn", { minScore: 0.9 }],
        "document-title": ["error", { minScore: 1 }],
        "html-has-lang": ["error", { minScore: 1 }],
        "meta-viewport": ["error", { minScore: 1 }],
      },
    },
    upload: { target: "temporary-public-storage" },
  },
};
