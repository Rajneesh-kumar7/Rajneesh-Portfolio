import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "three-stdlib"],
          "react-three": [
            "@react-three/fiber",
            "@react-three/drei",
            "@react-three/cannon",
            "@react-three/rapier",
            "@react-three/postprocessing",
          ],
          gsap: ["gsap", "@gsap/react"],
        },
      },
    },
  },
});
