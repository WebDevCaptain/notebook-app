import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (
  filename: string,
  dir: string
): express.Router => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    // Make sure the cell storage file exists
    try {
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      res.send(JSON.parse(result));
    } catch (err: any) {
      console.log(err);

      // if (err.code === "ENOENT") {
      //   await fs.writeFile(fullPath, JSON.stringify([]), "utf-8");
      //   res.send([]);
      // } else {
      //   throw err;
      // }
    }
  });

  router.post("/cells", async (req, res) => {
    const { cells }: { cells: Cell[] } = req.body;
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.status(201).send({ status: "OK" });
  });

  return router;
};
