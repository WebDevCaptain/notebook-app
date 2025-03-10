import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { createCellsRouter } from "./routes/cells";

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  const packagePath = require.resolve(
    "@cyberarmy-note/local-client/dist/index.html"
  );

  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    // Development Proxy
    app.use(
      createProxyMiddleware({
        target: "http://localhost:5173",
        ws: true,
        logLevel: "silent",
      })
    );
  } else {
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on("error", reject);
  });
};

serve(4005, "notebook.js", process.cwd(), true).then(() => {
  console.log("Listening on http://localhost:4005");
});
