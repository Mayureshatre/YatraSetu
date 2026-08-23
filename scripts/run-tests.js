/**
 * YatraSetu Automated Test Runner
 * Uses Node.js built-in test runner & assert module with fast Babel TypeScript transpilation
 */
const fs = require("fs");
const path = require("path");

// Fixed: Using standard Node.js module resolution instead of hardcoded Linux paths
const babel = require("@babel/core");
const presetTs = require("@babel/preset-typescript");
const presetReact = require("@babel/preset-react");
const pluginCjs = require("@babel/plugin-transform-modules-commonjs");

const tsCache = {};

// Custom require hook for TypeScript files
require.extensions[".ts"] = function (module, filename) {
  if (!tsCache[filename]) {
    const content = fs.readFileSync(filename, "utf8");
    const compiled = babel.transformSync(content, {
      filename,
      presets: [presetTs],
      plugins: [pluginCjs],
      configFile: false,
      babelrc: false,
    });
    tsCache[filename] = compiled.code;
  }
  module._compile(tsCache[filename], filename);
};

require.extensions[".tsx"] = function (module, filename) {
  if (!tsCache[filename]) {
    const content = fs.readFileSync(filename, "utf8");
    const compiled = babel.transformSync(content, {
      filename,
      presets: [presetReact, presetTs],
      plugins: [pluginCjs],
      configFile: false,
      babelrc: false,
    });
    tsCache[filename] = compiled.code;
  }
  module._compile(tsCache[filename], filename);
};

// Setup path alias @/ to src/ & package shims
const Module = require("module");
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    const relativePath = request.substring(2);
    // Assuming your app code is in a 'src' folder at the root
    const resolvedPath = path.resolve(__dirname, "../src", relativePath);
    return originalResolveFilename.call(
      this,
      resolvedPath,
      parent,
      isMain,
      options,
    );
  }

  // Custom shims for testing
  if (request === "zod") {
    return path.resolve(__dirname, "shims/zod.js");
  }
  if (request === "clsx") {
    return path.resolve(__dirname, "shims/clsx.js");
  }
  if (request === "tailwind-merge") {
    return path.resolve(__dirname, "shims/tailwind-merge.js");
  }
  if (request === "@supabase/supabase-js") {
    return path.resolve(__dirname, "shims/supabase.js");
  }
  if (request === "next/server") {
    return path.resolve(__dirname, "shims/next-server.js");
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

console.log("====================================================");
console.log("🚀 YatraSetu Automated Test Suite & QA Verification");
console.log("====================================================\n");

const testDir = path.resolve(__dirname, "../src/tests");

// Ensure the tests directory actually exists before trying to read it
if (!fs.existsSync(testDir)) {
  console.error(`❌ Test directory not found at: ${testDir}`);
  console.error(
    'Please make sure your test files are located in the "src/tests" folder.',
  );
  process.exit(1);
}

const testFiles = fs
  .readdirSync(testDir)
  .filter((f) => f.endsWith(".test.ts") || f.endsWith(".test.js"));

if (testFiles.length === 0) {
  console.log(
    "⚠️ No test files found in src/tests. Create a file ending with .test.js or .test.ts",
  );
  process.exit(0);
}

let failedSuites = 0;

for (const file of testFiles) {
  console.log(`\n📋 Running test suite: ${file}`);
  try {
    require(path.join(testDir, file));
  } catch (err) {
    console.error(`❌ Suite failure in ${file}:`, err);
    failedSuites++;
  }
}

if (failedSuites > 0) {
  console.error(`\n❌ ${failedSuites} test suites failed!`);
  process.exit(1);
} else {
  console.log(
    `\n✅ All YatraSetu test suites loaded and executed successfully!`,
  );
}
