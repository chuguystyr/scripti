import { fixupConfigRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import tseslint from "typescript-eslint"

const compat = new FlatCompat()

export default [
  {
    ignores: [".next/", "node_modules/", ".vercel/", ".vscode/"],
  },
  ...tseslint.configs.recommended,
  ...fixupConfigRules(compat.extends("plugin:@next/next/recommended")),
  {
    files: ["**/**/*.js", "**/**/*.ts", "**/**/*.jsx", "**/**/*.tsx"],
	languageOptions: {
		parserOptions: {
		  ecmaVersion: "latest",
		  sourceType: "module",
		  ecmaFeatures: {
			jsx: true,
		  },
		},
	  },
  },
]
