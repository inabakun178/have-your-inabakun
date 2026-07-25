import js from "@eslint/js";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

const config = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  // next/core-web-vitals は react/react-in-jsx-scope や react/prop-types を
  // 無効化するため、react の recommended より後ろに置く
  ...nextCoreWebVitals,
  // prettier と競合するフォーマット系ルールを落とすので必ず最後
  prettier,
];

export default config;
