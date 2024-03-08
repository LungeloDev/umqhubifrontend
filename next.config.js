const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
  },
  reactStrictMode: false,
  trailingSlash: true,
  env: {
    google_map: "your_google_map_key",
    product_mode: "production",
    backend_url:
      process.env.NODE_ENV === "development"
        ? "http://192.168.0.185:5900/"
        : "https://car2gobackend.appstick.com.bd/",
    socket_io:
      process.env.NODE_ENV === "development"
        ? "http://192.168.0.185:5900"
        : "https://car2gobackend.appstick.com.bd",
  },
});
