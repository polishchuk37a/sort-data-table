import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Album} from "../interfaces/album";
import {Slice} from "../interfaces/slice";

@Injectable({
  providedIn: 'root'
})
export class TableListService {
  private _tableList: Album[] = [];
  private _localTableList$ = new BehaviorSubject<Album[]>([]);

  getTableList$(): Observable<Album[]> {
    return this._localTableList$.asObservable();
  }

  setTableList(data: Album[]): void {
    this._tableList = data;
  }

  getActualList(sliceData: Slice): void {
    this._localTableList$.next(this._tableList.slice(sliceData.start, sliceData.end));
  }

  getSliceData(selectedPage: number, selectedCount: number): Slice {
    const start = (selectedPage - 1) * selectedCount;
    const end = (selectedPage - 1) * selectedCount + selectedCount;

    return {start, end};
  }
}
