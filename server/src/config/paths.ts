import path from "node:path";

export const SRC = path.join(import.meta.dirname, "../.")
export const ROOT = path.join(SRC, "../../.")
export const SERVER_ROOT = path.join(ROOT, "./server")
export const DATA = path.join(ROOT, "./data")
export const MIGRATIONS = path.join(SERVER_ROOT, "./drizzle")