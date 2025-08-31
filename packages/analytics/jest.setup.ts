import "@testing-library/jest-dom";

jest.mock("@vercel/analytics", () => ({
  track: jest.fn(),
  Analytics: () => null,
}));

jest.mock("@vercel/analytics/react", () => ({
  Analytics: () => null,
}));

jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => null,
}));
