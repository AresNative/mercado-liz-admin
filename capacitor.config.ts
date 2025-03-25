import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "adminv2",
  webDir: "public",
  server: {
    url: "http://localhost:3000", // Para desarrollo
    cleartext: true,
  },
};

export default config;
