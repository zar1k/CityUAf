import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';
// import {UaCityTableDataSource} from './ua-city-table-datasource';
import {merge,  of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

import {CityService} from '../service/city.service';
import {City} from '../model/city';

@Component({
  selector: 'app-ua-city-table',
  templateUrl: './ua-city-table.component.html',
  styleUrls: ['./ua-city-table.component.css']
})
export class UaCityTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // dataSource: UaCityTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'population'];
  service: CityService | null;
  citySource: City[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    // this.dataSource = new UaCityTableDataSource(this.paginator, this.sort);
    this.service = new CityService(this.http);

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.getCityWithPage(this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalElements;

          return this.citySource = data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty dataSource.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.citySource = data);
  }
}
