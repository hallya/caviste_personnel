import { defineConfig } from "tsup";
import { readFileSync } from "fs";
import { resolve } from "path";

export function createTsupConfig(packageDir = ".") {
  const packageJsonPath = resolve(packageDir, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

  const dependencies = Object.keys(packageJson.dependencies || {});
  const peerDependencies = Object.keys(packageJson.peerDependencies || {});

  const alwaysExternal = ["react", "react-dom", "next"];
  const internalPackages = dependencies.filter((dep) =>
    dep.startsWith("@pkg/")
  );

  const external = [
    ...new Set([...alwaysExternal, ...peerDependencies, ...internalPackages]),
  ];

  const isDev = process.env.NODE_ENV === "development";

  return defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external,
    treeshake: true,
    minify: !isDev,
    target: "esnext",
  });
}
