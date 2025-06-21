import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private all = Array.from({ length: 100 }).map((_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  getItems(page: number, pageSize: number): Observable<{ items: any[]; total: number }> {
    const start = (page - 1) * pageSize;
    return of({
      items: this.all.slice(start, start + pageSize),
      total: this.all.length
    })
  }
}
