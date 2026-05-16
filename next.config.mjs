import nextI18NextConfig from './next-i18next.config.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 99999,
  i18n: nextI18NextConfig.i18n,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
});
