"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const Document_1 = require("./core/entities/Document");
const DocumentsService_1 = require("./core/services/DocumentsService");
const DbConnectionConfig_1 = require("./infrastructure/DbConnectionConfig");
const DocumentsRepository_1 = require("./infrastructure/DocumentsRepository");
const app = express_1.default();
const port = 8080; // default port to listen
// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jsonParser = bodyParser.json();
const pool = new pg_1.Pool(DbConnectionConfig_1.dbConnectionConfig);
const documentService = new DocumentsService_1.DocumentsService(new DocumentsRepository_1.DocumentRepository(pool));
app.post("/list/:collection", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const collection = req.params.collection;
    const response = yield documentService.getAll(collection);
    res.send(response);
}));
app.post("/get/:record_id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const record_id = req.params.record_id;
    const response = yield documentService.get(record_id);
    res.send(response);
}));
app.post("/delete/:record_id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const record_id = req.params.record_id;
    const response = yield documentService.delete(record_id);
    res.send(response);
}));
app.post("/add", jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const document = new Document_1.Document();
    document.collectionName = req.body.collectionName;
    document.data = req.body.data;
    const response = yield documentService.add(document);
    res.send(response);
}));
app.post("/test", (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.setHeader("Content-Type", "text/plain");
    res.write("you posted:\n");
    res.end(JSON.stringify(req.body, null, 2));
}));
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map