import { Injectable } from '@angular/core';
import {AlbumService} from "./album.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Album} from "../interfaces/album";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TableListService {
  private _localTableList$ = new BehaviorSubject<Album[]>([] as Album[]);
  private _startIndexForSlice = 0;
  private _endIndexForSlice = 0;

  get tableList(): Observable<Album[]> {
    return this._localTableList$.asObservable();
  }

  constructor(private readonly albumService: AlbumService) { }

  getAlbums(): Observable<Album[]> {
    return this.albumService.getAlbumData()
      .pipe(
        tap(res => this._localTableList$.next(res)),
      );
  }

  sliceTableList(): Album[] {
    return this._localTableList$.value.slice(this._startIndexForSlice, this._endIndexForSlice);
  }

  getIndexesForSlice(selectedPage: number, selectedCount: number) {
    this._startIndexForSlice = (selectedPage - 1) * selectedCount;
    this._endIndexForSlice = (selectedPage - 1) * selectedCount + selectedCount;
  }
}
