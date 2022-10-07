import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Order} from "../../enums/order";
import {SortData} from "../../interfaces/sort-data";
import {PersonInfo} from "../../interfaces/person-info";

@Component({
  selector: 'app-header-row',
  templateUrl: './header-row.component.html',
  styleUrls: ['./header-row.component.scss']
})
export class SortComponent {
  @Input() selectedOrder = Order.Default;
  @Input() title: string;
  @Output() onOrderChange = new EventEmitter<SortData>();

  get order(): string {
    switch (this.selectedOrder) {
      case Order.Asc:
        return 'Asc';

      case Order.Desc:
        return 'Desc';

      case Order.Default:
        return 'Default';

      default:
        return 'Default';
    }
  }

  constructor() {
  }

  toggleOrder(): void {
    if (this.selectedOrder === Order.Default) {
      this.selectedOrder = Order.Asc;
    } else {
      this.selectedOrder = this.selectedOrder === Order.Asc ? Order.Desc : Order.Default;
    }

    this.onOrderChange.emit({title: this.title as keyof PersonInfo, order: this.selectedOrder});
  }
}
