import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {AlbumService} from "../services/album.service";
import {finalize, takeUntil, tap} from "rxjs/operators";
import {Order} from "../enums/order";
import {Sort} from "../interfaces/sort";
import {SortService} from "../services/sort.service";
import {Album} from "../interfaces/album";
import {FormControl} from "@angular/forms";
import {TableListService} from "../services/table-list.service";

@Component({
  selector: 'app-sorting-table',
  templateUrl: './sorting-table.component.html',
  styleUrls: ['./sorting-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortingTableComponent implements OnInit, OnDestroy {
  albums: Album[];

  tableHeaderColumn = [
    {title: 'id', order: Order.Default},
    {title: 'title', order: Order.Default}
  ];

  albumCount = [
    {count: 5},
    {count: 10},
    {count: 15}
  ];

  albumCountControl = new FormControl(this.albumCount[0].count);
  selectedCount = this.albumCountControl.value;
  selectedPage = 1;

  private tableListLength = 0;
  private selectedSort: Sort;
  private unsubscribe$ = new Subject<void>();

  get pageNumbers(): number[] {
    return Array(Math.ceil(this.tableListLength / this.selectedCount)).fill(0).map((value, index) => index + 1);
  }

  get isFirstPageBtnDisabled(): boolean {
    return this.selectedPage === 1;
  }

  get isLastPageBtnDisabled(): boolean {
    return this.selectedPage === this.pageNumbers.length;
  }

  constructor(private readonly albumService: AlbumService,
              private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly sortService: SortService,
              private readonly tableListService: TableListService) { }

  ngOnInit(): void {
    this.albumCountControl.valueChanges
      .pipe(
        tap(value => {
          this.selectedCount = Number(value);
          this.selectedPage = 1;
          const sliceData = this.tableListService.getSliceData(this.selectedPage, this.selectedCount);
          this.tableListService.getActualList(sliceData);
        }),
        finalize(() => this.changeDetectorRef.markForCheck()),
        takeUntil(this.unsubscribe$)
      ).subscribe();

    this.albumService.getAlbumData()
      .pipe(
        tap((albums) => {
          this.tableListLength = albums.length;
          this.tableListService.setTableList(albums);
          const sliceData = this.tableListService.getSliceData(this.selectedPage, this.selectedCount);
          this.tableListService.getActualList(sliceData);
        }),
        finalize(() => this.changeDetectorRef.markForCheck()),
        takeUntil(this.unsubscribe$)
      ).subscribe();

    this.tableListService.getTableList$()
      .pipe(
        tap(actualList => {
          if (this.selectedSort) {
            this.albums = this.sortService.sort(this.selectedSort, actualList);
          } else {
            this.albums = actualList;
          }

          this.changeDetectorRef.markForCheck();
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }

  changePage(page: number): void {
    this.selectedPage = page;
    const sliceData = this.tableListService.getSliceData(page, this.selectedCount);
    this.tableListService.getActualList(sliceData);
  }

  resetOrderOnOrderChange(sort: Sort): void {
    this.tableHeaderColumn = this.tableHeaderColumn.map(column => {
      if (column.title !== sort.title) {
        column.order = Order.Default;

        return column;
      }

      column.order = sort.order;

      return column;
    });
  }

  sortData(sort: Sort): void {
    this.selectedSort = sort;
    this.resetOrderOnOrderChange(sort);
    this.albums = this.sortService.sort(sort, this.albums);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
