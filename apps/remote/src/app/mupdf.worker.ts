/// <reference lib="webworker" />
import * as mupdf from 'mupdf';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: type definition currently does not work during build
import * as Comlink from 'comlink-esm';

class MupdfWorker {
  private document?: mupdf.Document;

  loadDocument(buffer: ArrayBuffer) {
    this.document = mupdf.Document.openDocument(buffer, 'application/pdf');
  }

  loadPage(index: number) {
    return this.document?.loadPage(index);
  }

  countPages() {
    return this.document?.countPages();
  }
}

export { MupdfWorker };

Comlink.expose(MupdfWorker);

postMessage('READY');
