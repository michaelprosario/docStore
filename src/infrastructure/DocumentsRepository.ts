
import { Document } from "../core/entities/Document";
import { IDocumentRepository } from "../core/interfaces/IDocumentRepository";
// tslint:disable-next-line:ordered-imports
import { MongoClient } from "mongodb";
import { dbConnectionConfig } from "./DbConnectionConfig";

export class DocumentRepository implements IDocumentRepository {

    public async add(record: Document): Promise<string> {

        const client = await this.getClient();

        try {
            const collection = this.getCollectionByName(record.collectionName, client);
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

    public async delete(collectionName: string, recordId: string): Promise<void> {
        const client = await this.getClient();

        try {
            const collection = this.getCollectionByName(collectionName, client);
            const dbRecord = await collection.findOneAndDelete({ id: recordId });
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }

    }

    public async get(collectionName: string, recordId: string): Promise<Document> {
        const client = await this.getClient();

        let record: Document;

        try {
            const collection = this.getCollectionByName(collectionName, client);
            const dbRecord = await collection.findOne({ id: recordId });
            console.log(dbRecord);
            record = this.getDocumentFromRecord(dbRecord);
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }

        return record;
    }

    public async getAll(collectionName: string): Promise<Document[]> {

        const client = await this.getClient();
        const results = Array<Document>();

        try {
            const collection = this.getCollectionByName(collectionName, client);
            const records = await collection.find({}).toArray();
            records.forEach((element) => {
                const doc = this.getDocumentFromRecord(element);
                results.push(doc);
            });
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }

        return results;
    }

    public async recordExists(collectionName: string, recordId: string): Promise<boolean> {
        const client = await this.getClient();

        let result = false;

        try {
            const db = client.db(dbConnectionConfig.dbName);
            const collection = db.collection(collectionName);
            const dbRecord = await collection.findOne({ id: recordId });
            result = dbRecord !== null;
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }

        return result;
    }

    private getDocumentFromRecord(dbRecord: any): Document {
        const doc = new Document();
        doc.id = dbRecord.id;
        doc.data = dbRecord.data;
        doc.collectionName = dbRecord.collectionName;
        return doc;
    }

    private async getClient(): Promise<MongoClient> {
        return await MongoClient.connect(dbConnectionConfig.url, { useNewUrlParser: true });
    }

    private getCollectionByName(name: string, client: MongoClient) {
        const db = client.db(dbConnectionConfig.dbName);
        const collection = db.collection(name);
        return collection;
    }
}
