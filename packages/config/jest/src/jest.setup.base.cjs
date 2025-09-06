/* global jest */
jest.mock("next/server", () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((data, options) => ({
        json: jest.fn().mockResolvedValue(data),
        status: jest.fn().mockReturnThis(),
        headers: jest.fn().mockReturnThis(),
        ...options,
      })),
    },
    NextRequest: jest.fn().mockImplementation((url) => {
      const urlObj = new URL(url);
      return {
        url,
        searchParams: urlObj.searchParams,
      };
    }),
  };
});
