import "@testing-library/jest-dom";
import { ImageProps } from "next/image";
import React from "react";
import 'jest-axe/extend-expect'

// Mock next/navigation (App Router) au lieu de next/router (Pages Router)
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: ImageProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { unoptimized, ...domProps } = props;
     
    return React.createElement("img", domProps);
  },
}));
