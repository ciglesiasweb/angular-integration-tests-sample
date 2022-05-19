import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';
import { CarApiService } from 'src/app/features/services/car.service';
import { Car } from 'src/app/models/car.model';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarListComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<Car>;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  data: Car[] = [];

  constructor(
    public carApiService: CarApiService,
    private router: Router,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => {
          return event instanceof NavigationEnd;
        })
      )
      .subscribe((x) => {
        this.initDataTable();
      });
  }

  initDataTable(): void {
    this.paginator.page
      .pipe(
        startWith([]),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.carApiService
            .list()
            .pipe(catchError(() => observableOf(null)));
        }),
        map((data) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;
          this.resultsLength = (data && data.length) || 0;
          return data;
        })
      )
      .subscribe((data) => {
        this.data = data || [];
        this.changeDetectorRef.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    this.initDataTable();
  }
}
