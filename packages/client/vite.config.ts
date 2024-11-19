
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, PluginOption } from "vite"
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite() as PluginOption,
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
