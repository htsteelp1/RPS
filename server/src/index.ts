import "dotenv/config";
import http from "node:http"
import {app} from "./app.js";
import {db} from "./db/index.js"

const server = http.createServer(app);

server.listen(process.env.PORT ?? 3000, () => {
    // @ts-ignore
    console.log("Server is running on port " + server.address().port);
});
