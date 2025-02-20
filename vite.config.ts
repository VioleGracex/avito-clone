import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
 base: "/",
 plugins: [react(), tailwindcss()],
 preview: {
  port: 5174,
  strictPort: true,
 },
 server: {
  port: 5174,
  strictPort: true,
  host: true,
  origin: "http://0.0.0.0:5174",
 },
});