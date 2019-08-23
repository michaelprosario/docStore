import { assert, expect } from "chai";
import "mocha";
import { Document } from "../core/entities/Document";
import { DocumentsService } from "../core/services/DocumentsService";
import { DocumentRepository } from '../infrastructure/DocumentsRepository';
import { Pool } from "pg";
import { dbConnectionConfig } from "../infrastructure/DbConnectionConfig";

describe("DocumentsService(integration)", () => {
  describe("add", () => {
    const pool = new Pool(dbConnectionConfig)


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

});
