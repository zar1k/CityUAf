import {DataSource} from '@angular/cdk/collections';
import {MatPaginator, MatSort} from '@angular/material';
import {map} from 'rxjs/operators';
import {Observable, of as observableOf, merge} from 'rxjs';
import {City} from '../model/city';

// TODO: replace this with real data from your application
const EXAMPLE_DATA: City[] = [
  {
    'id': 1,
    'name': 'Киев',
    'population': 2587945
  },
  {
    'id': 2,
    'name': 'Харьков',
    'population': 1609959
  },
  {
    'id': 3,
    'name': 'Одесса',
    'population': 1115371
  },
  {
    'id': 4,
    'name': 'Днепр',
    'population': 1177897
  },
  {
    'id': 5,
    'name': 'Донецк',
    'population': 1109102
  },
  {
    'id': 6,
    'name': 'Запорожье',
    'population': 883909
  },
  {
    'id': 7,
    'name': 'Львов',
    'population': 790908
  },
  {
    'id': 8,
    'name': 'Кривой Рог',
    'population': 713059
  },
  {
    'id': 9,
    'name': 'Николаев',
    'population': 502776
  },
  {
    'id': 10,
    'name': 'Луганск',
    'population': 496813
  },
  {
    'id': 11,
    'name': 'Винница',
    'population': 374304
  },
  {
    'id': 12,
    'name': 'Макеевка',
    'population': 430201
  },
  {
    'id': 13,
    'name': 'Севастополь',
    'population': 356123
  },
  {
    'id': 14,
    'name': 'Симферополь',
    'population': 343565
  },
  {
    'id': 15,
    'name': 'Херсон',
    'population': 355379
  },
  {
    'id': 16,
    'name': 'Полтава',
    'population': 314740
  },
  {
    'id': 17,
    'name': 'Чернигов',
    'population': 296347
  },
  {
    'id': 18,
    'name': 'Черкассы',
    'population': 290340
  },
  {
    'id': 19,
    'name': 'Хмельницкий',
    'population': 236938
  },
  {
    'id': 20,
    'name': 'Житомир',
    'population': 292097
  },
  {
    'id': 21,
    'name': 'Черновцы',
    'population': 256644
  },
  {
    'id': 22,
    'name': 'Сумы',
    'population': 291264
  },
  {
    'id': 23,
    'name': 'Горловка',
    'population': 338106
  },
  {
    'id': 24,
    'name': 'Ровно',
    'population': 227925
  },
  {
    'id': 25,
    'name': 'Ивано-Франковск',
    'population': 214021
  },
  {
    'id': 26,
    'name': 'Каменское',
    'population': 281925
  },
  {
    'id': 27,
    'name': 'Кропивницкий',
    'population': 269803
  },
  {
    'id': 28,
    'name': 'Кременчуг',
    'population': 236495
  },
  {
    'id': 29,
    'name': 'Тернополь',
    'population': 204845
  },
  {
    'id': 30,
    'name': 'Луцк',
    'population': 197724
  }
];

/**
 * Data source for the UaCityTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class UaCityTableDataSource extends DataSource<City> {
  data: City[] = EXAMPLE_DATA;

  constructor(private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<City[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginators length
    this.paginator.length = this.data.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.data]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: City[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: City[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        case 'name':
          return compare(a.name, b.name, isAsc);
        case 'population':
          return compare(+a.population, +b.population, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
