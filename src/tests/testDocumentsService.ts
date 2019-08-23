import { Arg, Substitute } from '@fluffy-spoon/substitute';
import { assert } from "chai";
import "mocha";
import { Document } from "../core/entities/Document";
import { IDocumentRepository } from "../core/interfaces/IDocumentRepository";
import { DocumentsService } from "../core/services/DocumentsService";

describe("DocumentsService", () => {
  describe("add", () => {
    it("should work", () => {
      // arrange
      const doc: Document = new Document();
      doc.collectionName = "thing";
      doc.data = "data";

      const documentRepository = Substitute.for<IDocumentRepository>();
      const service = new DocumentsService(documentRepository);

      // act
      const recordId = service.add(doc);

      // assert
      assert.isTrue(recordId != null);
      documentRepository.received().add(Arg.any());

    });
  });
});
