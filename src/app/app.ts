import { Component, DestroyRef } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from './item.service';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './app.html',
})
export class App {
  private page$ = new BehaviorSubject(1);
  private pageSize$ = new BehaviorSubject(20);

  data$ = combineLatest([this.page$, this.pageSize$]).pipe(
    switchMap(([page, pageSize]) => this.itemService.getItems(page, pageSize))
  );

  items$ = this.data$.pipe(map(res => res.items));
  total$ = this.data$.pipe(map(res => res.total));
  range$ = combineLatest([this.page$, this.pageSize$, this.total$]).pipe(
    map(([p, s, total]) => {
      const start = (p - 1) * s + 1;
      const end = Math.min(p * s, total);
      return `Showing items ${start}–${end} of ${total}`;
    })
  );

  get pageNumbers() {
    const total = this.totalSource;
    const size = this.pageSizeSource;
    return Array.from({ length: Math.ceil(total / size) }, (_, i) => i + 1);
  }

  // Expose synchronous snapshot for template tracking
  private totalSource = 0;
  private pageSizeSource = 0;

  constructor(private itemService: ItemService, private readonly destroyRef: DestroyRef) {
    this.total$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(t => this.totalSource = t);
    this.pageSize$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(s => this.pageSizeSource = s);
  }

  onPageChange(n: number) {
    this.page$.next(n);
  }

  onPageSizeChange(s: number) {
    this.pageSize$.next(s);
    this.page$.next(1);
  }
}
