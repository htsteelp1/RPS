/// <reference types="node"/>
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import {DATA, ROOT} from "./src/config/paths";
import path from "node:path"

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: path.join(DATA, "./app.db"),
    },
});
