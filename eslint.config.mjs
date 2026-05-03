import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "dist/**",
      "out/**",
      "cloudflare-env.d.ts"
    ]
  },
  ...nextVitals,
  ...nextTs
];

export default eslintConfig;
