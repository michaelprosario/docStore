
import { Document } from "../core/entities/Document";
import { IDocumentRepository } from "../core/interfaces/IDocumentRepository";
// tslint:disable-next-line:ordered-imports
import { MongoClient } from "mongodb";
import { dbConnectionConfig } from "./DbConnectionConfig";

export class DocumentRepository implements IDocumentRepository {

    public async add(record: Document): Promise<string> {

        const client = await MongoClient.connect(dbConnectionConfig.url, { useNewUrlParser: true })
            .catch((err) => { console.log(err); });

        if (!client) {
            return;
        }

        try {
            const db = client.db(dbConnectionConfig.dbName);
            const collection = db.collection(record.collectionName);
            await collection.insertOne(record);
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }

        return record.id;
    }

    public async update(record: Document): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async delete(collection: string, recordId: string): Promise<void> {
        throw new Error("Method not implemented.");

    }

    public async get(collectionName: string, recordId: string): Promise<Document> {
        const client = await MongoClient.connect(dbConnectionConfig.url, { useNewUrlParser: true })
            .catch((err) => { console.log(err); });

        if (!client) {
            return;
        }

        const record = new Document();

        try {
            const db = client.db(dbConnectionConfig.dbName);
            const collection = db.collection(collectionName);
            const dbRecord = await collection.findOne({ id: recordId });
            record.id = dbRecord.id;
            record.data = dbRecord.data;
            record.collectionName = dbRecord.collectionName;

        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }

        return record;
    }

    public async getAll(collectionName: string): Promise<Document[]> {

        const results = Array<Document>();
        const client = await MongoClient.connect(dbConnectionConfig.url, { useNewUrlParser: true })
            .catch((err) => { console.log(err); });

        if (!client) {
            return;
        }

        try {
            const db = client.db(dbConnectionConfig.dbName);
            const collection = db.collection(collectionName);
            const records = await collection.find({}).toArray();
            records.forEach((element) => {
                const doc = new Document();
                doc.id = element.id;
                doc.data = element.data;
                doc.collectionName = element.collectionName;
                results.push(doc);
            });
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }

        return results;
    }

    public async recordExists(recordId: string): Promise<boolean> {
        return false;
    }

    private populateEntityFromRecord(document: Document, record: any) {
        document.collectionName = record.collection_name;
        document.data = record.document_data;
        document.id = record.id;
    }
}
