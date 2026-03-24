const http = require("http");
const httpProxy = require("http-proxy");

const proxy = httpProxy.createProxy();

const server = http.createServer((req, res) => {
  if (req.url.includes("/api/")) {
    proxy.web(req, res, {
      target: "http://localhost:5000",
      changeOrigin: true,
    });
  } else {
    proxy.web(req, res, { target: "http://localhost:4444" });
  }
});

server.listen(process.env.PORT || 8000, () => {
  console.log("server is listening");
});
