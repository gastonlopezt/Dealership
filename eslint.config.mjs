import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import next from "eslint-config-next";

const compat = new FlatCompat();

export default [
  // Base JS rules
  js.configs.recommended,
  // Next.js recommended + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Next flat config
  ...next,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
