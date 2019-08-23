import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { assert, expect } from "chai";
import "mocha";
import { Document } from "../core/entities/Document";
import { IDocumentRepository } from "../core/interfaces/IDocumentRepository";
import { DocumentsService } from "../core/services/DocumentsService";

describe("DocumentsService", () => {
  describe("validate", () => {

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

});
