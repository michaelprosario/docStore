import { Arg, Substitute } from "@fluffy-spoon/substitute";
import { assert, expect } from "chai";
import "mocha";
import { Document } from "../core/entities/Document";
import { IDocumentRepository } from "../core/interfaces/IDocumentRepository";
import { DocumentsService } from "../core/services/DocumentsService";

describe("DocumentsService", () => {
  describe("validate", () => {

    it("should return no errors if input perfect", () => {
      // arrange
      const doc: Document = new Document();
      doc.collectionName = "thing";
      doc.data = "data";

      const documentRepository = Substitute.for<IDocumentRepository>();
      const service = new DocumentsService(documentRepository);

      // act
      const errors = service.validate(doc);

      // assert
      assert.isTrue(errors.length === 0);
    });

    it("should return errors if input not perfect", () => {
      // arrange
      const doc: Document = new Document();
      doc.collectionName = "";
      doc.data = "";

      const documentRepository = Substitute.for<IDocumentRepository>();
      const service = new DocumentsService(documentRepository);

      // act
      const errors = service.validate(doc);

      // assert
      assert.isTrue(errors.length > 0);
    });

  });

  describe("add", () => {

    it("should work when document perfect", async () => {
      // arrange
      const doc: Document = new Document();
      doc.collectionName = "thing";
      doc.data = "data";

      const documentRepository = Substitute.for<IDocumentRepository>();
      const service = new DocumentsService(documentRepository);

      // act
      const response = await service.add(doc);

      // assert
      assert.isTrue(response.recordId != null);
      documentRepository.received().add(Arg.any());
    });

    it("should fail when document null", async () => {
      // arrange
      const doc: Document = null;
      const documentRepository = Substitute.for<IDocumentRepository>();
      const service = new DocumentsService(documentRepository);

      // act
      const response = await service.add(doc);

      // assert
      assert.isTrue(response.code === 400);
      assert.isTrue(response.message !== "ok");
    });

  });
});
