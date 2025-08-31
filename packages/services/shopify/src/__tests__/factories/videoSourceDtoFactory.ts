import { faker } from "@faker-js/faker";
import { type VideoSource } from "../../__generated__/graphql";

const videoSources: VideoSource[] = [
  {
    __typename: "VideoSource",
    url: "https://quickstart-4b086c0a.myshopify.com/cdn/shop/videos/c/vp/53550df4a7554d84bf75e2ac58aa5273/53550df4a7554d84bf75e2ac58aa5273.HD-1080p-7.2Mbps-54500410.mp4",
    mimeType: "video/mp4",
    format: "mp4",
    height: 1080,
    width: 1920,
  },
  {
    __typename: "VideoSource",
    url: "https://quickstart-4b086c0a.myshopify.com/cdn/shop/videos/c/vp/53550df4a7554d84bf75e2ac58aa5273/53550df4a7554d84bf75e2ac58aa5273.m3u8",
    mimeType: "application/x-mpegURL",
    format: "m3u8",
    height: 1080,
    width: 1920,
  },
  {
    __typename: "VideoSource",
    url: "https://quickstart-4b086c0a.myshopify.com/cdn/shop/videos/c/vp/53550df4a7554d84bf75e2ac58aa5273/53550df4a7554d84bf75e2ac58aa5273.HD-720p-4.5Mbps-54500410.mp4",
    mimeType: "video/mp4",
    format: "mp4",
    height: 720,
    width: 1280,
  },
  {
    __typename: "VideoSource",
    url: "https://quickstart-4b086c0a.myshopify.com/cdn/shop/videos/c/vp/53550df4a7554d84bf75e2ac58aa5273/53550df4a7554d84bf75e2ac58aa5273.SD-480p-1.5Mbps-54500410.mp4",
    mimeType: "video/mp4",
    format: "mp4",
    height: 480,
    width: 854,
  },
];

export function videoSourceDtoFactory(): VideoSource[] | null {
  return faker.helpers.arrayElement([
    null,
    faker.helpers.arrayElements(videoSources, {
      min: 1,
      max: videoSources.length,
    }),
  ]);
}
