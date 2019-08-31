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
const Document_1 = require("./core/entities/Document");
const DocumentsService_1 = require("./core/services/DocumentsService");
const DocumentsRepository_1 = require("./infrastructure/DocumentsRepository");
const app = express_1.default();
const port = 8080; // default port to listen
// body parser
app.use(bodyParser.json());
const jsonParser = bodyParser.json();
const documentService = new DocumentsService_1.DocumentsService(new DocumentsRepository_1.DocumentRepository());
app.post("/list/:collection", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const collection = req.params.collection;
    const response = yield documentService.getAll(collection);
    res.send(response);
}));
app.post("/get/:collection/:record_id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const record_id = req.params.record_id;
    const collection = req.params.collection;
    const response = yield documentService.get(collection, record_id);
    res.send(response);
}));
app.post("/delete/:collection/:record_id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    const record_id = req.params.record_id;
    const collection = req.params.collection;
    const response = yield documentService.delete(collection, record_id);
    res.send(response);
}));
app.post("/add", jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const document = new Document_1.Document();
    document.collectionName = req.body.collectionName;
    document.data = req.body.data;
    const response = yield documentService.add(document);
    res.send(response);
}));
app.post("/update", jsonParser, (req, res) => __awaiter(this, void 0, void 0, function* () {
    const document = new Document_1.Document();
    document.id = req.body.id;
    document.collectionName = req.body.collectionName;
    document.data = req.body.data;
    const response = yield documentService.update(document);
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