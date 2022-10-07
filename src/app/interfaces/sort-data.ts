import {PersonInfo} from "./person-info";
import {Order} from "../enums/order";

export interface SortData {
  title: keyof PersonInfo;
  order: Order;
}
