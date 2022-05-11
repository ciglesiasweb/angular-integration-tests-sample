import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs';
import { Car } from 'src/app/models/car.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarApiService {
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}
  url = environment.apiUrl;
  messages: string[] = [];

  list() {
    return this.activatedRoute.queryParams.pipe(
      switchMap((params: Params) => {
        let sufixUrlSearch = '';
        const search = params && params['q'];
        if (search) {
          sufixUrlSearch = `?q=${search}`;
        }
        return this.http.get<Car[]>(`${this.url}/cars${sufixUrlSearch}`);
      })
    );
  }
}
