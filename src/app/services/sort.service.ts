import { Injectable } from '@angular/core';
import {Order} from "../enums/order";
import {Sort} from "../interfaces/sort";
import {Album} from "../interfaces/album";

@Injectable({
  providedIn: 'root'
})
export class SortService {

  sort(sort: Sort, tableData: Album[]): Album[] {
    const tableSource = tableData.slice();

    switch (sort.order) {
      case Order.Asc:
        return tableSource.sort((a, b) => a[sort.title] > b[sort.title] ? 1 : -1);

      case Order.Desc:
        return tableSource.sort((a, b) => a[sort.title] < b[sort.title] ? 1 : -1);

      case Order.Default:
        return tableSource.sort((a, b) => a.id > b.id ? 1 : -1);

      default:
        return tableSource;
    }
  }
}
