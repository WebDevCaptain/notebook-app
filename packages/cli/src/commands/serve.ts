import { Command } from "commander";
import { serve } from "@cyberarmy-note/local-api";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p, --port <number>", "Port to run server on", "4005")
  .action(async (filename = "notebook.js", options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      const parsedFilename = path.basename(filename);
      const PORT = options.port;
      await serve(parseInt(PORT), parsedFilename, dir, !isProduction);
      console.log(`
        Opened ${filename}. Navigate to http://localhost:${PORT} to edit the file.
      `);
    } catch (err: any) {
      if (err.code === "EADDRINUSE") {
        console.log(
          `PORT ${options.port} is in use. Try running on a different port.`
        );
      } else {
        console.log("Problem: ", err.message);
      }

      process.exit(1);
    }
  });
