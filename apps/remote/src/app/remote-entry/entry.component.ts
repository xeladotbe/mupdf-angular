import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import * as Comlink from 'comlink';
import { type MupdfWorker } from '../mupdf.worker';
import { NxWelcomeComponent } from './nx-welcome.component';

interface MupdfWorkerWrapper {
  new (): MupdfWorker;
}

@Component({
  standalone: true,
  imports: [CommonModule, HttpClientModule, NxWelcomeComponent],
  selector: 'app-remote-entry',
  template: `<app-nx-welcome></app-nx-welcome>`,
})
export class RemoteEntryComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private readonly httpClient = inject(HttpClient);

  private worker?: Comlink.Remote<MupdfWorker>;

  ngOnDestroy(): void {
    this.worker?.[Comlink.releaseProxy];
  }

  async ngOnInit() {
    this.httpClient
      .get('/proxy/remote/assets/dummy.pdf', { responseType: 'arraybuffer' })
      .subscribe(async (buffer) => {
        this.worker = await new Promise<Comlink.Remote<MupdfWorker>>(
          (resolve) => {
            const worker = new Worker(
              new URL(
                /* webpackChunkName: "mupdf-worker" */ '../mupdf.worker',
                import.meta.url
              ),
              {
                type: 'module',
              }
            );

            worker.addEventListener(
              'message',
              async () => {
                const WorkerClazz = Comlink.wrap<MupdfWorkerWrapper>(worker);

                resolve(await new WorkerClazz());
              },
              { once: true }
            );
          }
        );

        await this.worker.loadDocument(buffer);

        console.log(await this.worker.countPages());
      });
  }
}
