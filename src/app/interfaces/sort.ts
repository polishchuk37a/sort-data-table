import {Order} from "../enums/order";
import {Album} from "./album";

export interface Sort {
  title: keyof Album;
  order: Order;
}
