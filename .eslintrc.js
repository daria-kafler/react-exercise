module.exports = {
  extends: ["@cruk", "next/core-web-vitals"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  rules: {
    // It's ok to have dev dependencies imported for test files
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/require-await": "off",
    "@next/next/no-img-element": "off"
  },
  ignorePatterns: ["*.config.js", "node_modules"],
};
