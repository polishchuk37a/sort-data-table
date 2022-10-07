import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Order} from "../../enums/order";
import {Sort} from "../../interfaces/sort";
import {Person} from "../../interfaces/person";

@Component({
  selector: 'app-header-row',
  templateUrl: './header-row.component.html',
  styleUrls: ['./header-row.component.scss']
})
export class SortComponent {
  @Input() selectedOrder = Order.Default;
  @Input() title: string;
  @Output() orderChanged = new EventEmitter<Sort>();

  get order(): string {
    switch (this.selectedOrder) {
      case Order.Asc:
        return 'Asc';

      case Order.Desc:
        return 'Desc';

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

    this.orderChanged.emit({title: this.title as keyof Person, order: this.selectedOrder});
  }
}
