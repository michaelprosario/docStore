import bodyParser = require("body-parser");
import express from "express";
import { Pool } from "pg";
import { Document } from "./core/entities/Document";
import { DocumentsService } from "./core/services/DocumentsService";
import { dbConnectionConfig } from "./infrastructure/DbConnectionConfig";
import { DocumentRepository } from "./infrastructure/DocumentsRepository";

const app = express();
const port = 8080; // default port to listen

// body parser

app.use(bodyParser.json());

const jsonParser = bodyParser.json();

const pool = new Pool(dbConnectionConfig);
const documentService = new DocumentsService(new DocumentRepository(pool));

app.post("/list/:collection", async (req, res) => {
    const collection = req.params.collection;
    const response = await documentService.getAll(collection);
    res.send(response);
});

app.post("/get/:record_id", async (req, res) => {
    const record_id = req.params.record_id;
    const response = await documentService.get(record_id);
    res.send(response);
});

app.post("/delete/:record_id", async (req, res) => {
    const record_id = req.params.record_id;
    const response = await documentService.delete(record_id);
    res.send(response);
});

app.post("/add", jsonParser, async (req, res) => {
    const document = new Document();
    document.collectionName = req.body.collectionName;
    document.data = req.body.data;
    const response = await documentService.add(document);
    res.send(response);
});

app.post("/test", async (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.write("you posted:\n");
    res.end(JSON.stringify(req.body, null, 2));
});

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
