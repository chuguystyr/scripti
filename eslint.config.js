import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "prettier", "next/typescript"),
  {
    ignores: [".husky", ".vercel", ".vscode", "node_modules", "**.js"],
  },
]

export default eslintConfig
