import { Component, computed, inject, signal } from '@angular/core';
import { ItemService } from './item.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  private readonly itemService = inject(ItemService);
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly data = rxResource<{ items: any[]; total: number }, { page: number; size: number }>({
    params: () => ({ page: this.page(), size: this.pageSize() }),
    stream: ({ params }) =>
      this.itemService.getItems(params.page, params.size),
    defaultValue: { items: [], total: 0 }
  });
  readonly items = computed(() => this.data.value().items ?? []);
  readonly total = computed(() => this.data.value().total ?? 0);
  readonly totalPages = computed(() => Math.ceil(this.total() / this.pageSize()));

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  readonly range = computed(() => {
    const p = this.page(), s = this.pageSize(), t = this.total();
    const start = (p - 1) * s + 1;
    const end = Math.min(p * s, t);
    return `Showing items ${start}–${end} of ${t}`;
  });
}
