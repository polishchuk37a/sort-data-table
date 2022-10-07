import { Injectable } from '@angular/core';
import {Order} from "../enums/order";
import {Sort} from "../interfaces/sort";
import {Person} from "../interfaces/person";

@Injectable({
  providedIn: 'root'
})
export class SortService {

  sort(sort: Sort, person: Person[]): void {
    switch (sort.order) {
      case Order.Asc:
        person.sort((a, b) => a[sort.title] > b[sort.title] ? 1 : -1);
        break;

      case Order.Desc:
        person.sort((a, b) => a[sort.title] < b[sort.title] ? 1 : -1);
        break;

      case Order.Default:
        person.sort((a, b) => a.id > b.id ? 1 : -1);
        break;

      default:
        break;
    }
  }
}
