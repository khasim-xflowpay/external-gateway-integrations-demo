import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const api = { target: "http://localhost:8787", changeOrigin: true };

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		// Lets phones on the same Wi-Fi open the dev server, to try UPI Intent on mobile web
		host: true,
		proxy: {
			"/api": api,
			"/create-checkout-session": api,
			"/session-status": api,
		},
	},
});
