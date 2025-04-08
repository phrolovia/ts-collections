import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/dist",
    "**/node_modules",
    "**/*.config.mts",
    "**/dist/",
    "**/node_modules/",
    "**/*.config.mts",
    "**/*.config.js",
    "**/*.config.ts",
    "**/coverage/",
    "**/html/",
]), {
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "@typescript-eslint/explicit-function-return-type": "off",

        "@typescript-eslint/member-ordering": ["error", {
            classes: {
                memberTypes: [
                    "signature",
                    "#private-static-readonly-field",
                    "#private-static-field",
                    "#private-instance-readonly-field",
                    "#private-readonly-field",
                    "#private-instance-field",
                    "#private-field",
                    "private-static-readonly-field",
                    "private-instance-readonly-field",
                    "private-readonly-field",
                    "private-instance-field",
                    "protected-static-readonly-field",
                    "protected-instance-readonly-field",
                    "protected-readonly-field",
                    "protected-instance-field",
                    "public-static-readonly-field",
                    "public-instance-readonly-field",
                    "public-readonly-field",
                    "public-instance-field",
                    "private-static-field",
                    "protected-static-field",
                    "public-static-field",
                    "protected-abstract-field",
                    "public-abstract-field",
                    "public-constructor",
                    "protected-constructor",
                    "private-constructor",
                    "public-static-method",
                    "protected-static-method",
                    "private-static-method",
                    "public-instance-method",
                    "protected-instance-method",
                    "private-instance-method",
                    "protected-abstract-method",
                    "public-abstract-method",
                ],

                order: "alphabetically",
            },

            interfaces: ["signature", "field", "constructor", "method"],
            typeLiterals: ["signature", "field", "constructor", "method"],
        }],

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/no-explicit-any": "warn",
        "no-console": "warn",
    },
}]);