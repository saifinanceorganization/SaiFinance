// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import vue from "@astrojs/vue";
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://saifinance.com.au',
  integrations: [icon(), vue(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
