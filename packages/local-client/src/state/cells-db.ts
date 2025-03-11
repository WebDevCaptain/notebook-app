/**
 * Module for managing cells in IndexedDB.
 *
 * - getCells: Retrieves all cells from IndexedDB.
 * - saveCells: Saves an array of cells to IndexedDB (clearing any existing data).
 */

import { openDB, DBSchema, IDBPDatabase } from "idb";
import { Cell } from "./cell";

/**
 * Interface for the IndexedDB database schema.
 */
interface CellDB extends DBSchema {
  cells: {
    key: number;
    value: Cell;
    indexes: { "by-type": string };
  };
}

/**
 * Opens (or creates) the IndexedDB database for cells.
 *
 * @returns {Promise<IDBPDatabase<CellDB>>} A promise that resolves to the database instance.
 */
async function getDB(): Promise<IDBPDatabase<CellDB>> {
  return openDB<CellDB>("cell-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("cells")) {
        const store = db.createObjectStore("cells", { keyPath: "id" });
        store.createIndex("by-type", "type");
      }
    },
  });
}

/**
 * Saves an array of cells to IndexedDB.
 *
 * This function clears the existing cells store before saving new cells.
 *
 * @param {Cell[]} cells - Array of cell objects to be saved.
 * @returns {Promise<void>} A promise that resolves when the cells have been saved.
 */
export async function saveCellsInDB(cells: Cell[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("cells", "readwrite");
  const store = tx.objectStore("cells");

  // Clear existing cells
  await store.clear();

  // Add each cell to the store
  for (const cell of cells) {
    await store.put(cell);
  }

  await tx.done;
}

/**
 * Retrieves all cells from IndexedDB.
 *
 * @returns {Promise<Cell[]>} A promise that resolves to an array of cells.
 */
export async function getCellsFromDB(): Promise<{ data: Cell[] }> {
  const db = await getDB();
  const cells = await db.getAll("cells");

  return {
    data: cells,
  };
}
