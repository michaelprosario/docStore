import { assert, expect } from "chai";
import "mocha";
import { Document } from "../core/entities/Document";
import { DocumentsService } from "../core/services/DocumentsService";
import { DocumentRepository } from '../infrastructure/DocumentsRepository';
import { Pool } from "pg";
import { dbConnectionConfig } from "../infrastructure/DbConnectionConfig";

const pool = new Pool(dbConnectionConfig);

describe("DocumentsService(integration)", () => {
  describe("add", () => {

    it("should work when document is perfect", async () => {
      // arrange
      const doc: Document = new Document();
      doc.collectionName = "test";
      doc.data = "test data";

      const documentRepository = new DocumentRepository(pool);
      const service = new DocumentsService(documentRepository);

      // act
      const response = await service.add(doc);

      let recordExists = await documentRepository.recordExists(response.recordId);

      // assert
      assert.isTrue(response.code === 200);
      assert.isTrue(response.message === "ok");
      assert.isTrue(recordExists);
    });
  });

  describe("delete", () => {

    it("should work with perfect data", async () => {
      // arrange
      const doc: Document = new Document();
      doc.collectionName = "test";
      doc.data = "test data";

      const documentRepository = new DocumentRepository(pool);
      const service = new DocumentsService(documentRepository);
      const response = await service.add(doc);

      // act
      await documentRepository.delete(response.recordId);
      let recordExists = await documentRepository.recordExists(response.recordId);

      // assert
      assert.isTrue(response.code === 200);
      assert.isTrue(response.message === "ok");
      assert.isTrue(!recordExists);
    });
  });

  describe("get", () => {

    it("should work with perfect data", async () => {
      // arrange
      const doc: Document = new Document();
      doc.collectionName = "test";
      doc.data = "test data";

      const documentRepository = new DocumentRepository(pool);
      const service = new DocumentsService(documentRepository);
      const response = await service.add(doc);

      // act
      const output = await documentRepository.get(response.recordId);

      // assert
      assert.isTrue(response.code === 200);
      assert.isTrue(response.message === "ok");
      assert.isTrue(output.id !== "" && output.id !== null);
      assert.isTrue(output.collectionName === "test");
      assert.isTrue(output.data === "test data");
    });
  });

  describe("list", () => {

    it("should work with perfect data", async () => {
      // arrange
      const doc: Document = new Document();
      doc.collectionName = "test";
      doc.data = "test data";

      const documentRepository = new DocumentRepository(pool);
      const service = new DocumentsService(documentRepository);
      const response = await service.add(doc);

      // act
      const output = await documentRepository.getAll("test");

      // assert
      assert.isTrue(response.code === 200);
      assert.isTrue(response.message === "ok");
      assert.isTrue(output.length > 0);
    });
  });
});
