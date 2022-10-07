import {Person} from "./person";
import {Order} from "../enums/order";

export interface Sort {
  title: keyof Person;
  order: Order;
}
