import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Page} from '../model/page';
import {City} from '../model/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) {
  }

  getCityWithPage(page: number, size: number): Observable<Page<City>> {
    return this.http.get<Page<City>>(`http://localhost:8080/cities?page=${page}&size=${size}&sort=name,desc`);
  }
}
