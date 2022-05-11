import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CarListComponent } from '../../components/car-list/car-list.component';
import { SearchComponent } from '../../components/search/search.component';
import { CarListContainerComponent } from './car-list-container.component';

describe('CarListContainerComponent ', () => {
  let component: CarListContainerComponent;
  let fixture: ComponentFixture<CarListContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CarListContainerComponent,
        SearchComponent, // Si.. necesitamos compilar también esta componente.
        CarListComponent, // Si.. necesitamos compilar también esta componente.
      ],
      imports: [
        NoopAnimationsModule, // Todos los imports necesdarios para que funcione el test.
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'car-list',
            component: CarListContainerComponent,
          },
        ]),
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatProgressSpinnerModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show the search field and a table above', () => {
    const nativeElement = fixture.debugElement.nativeElement;

    const searchFieldEl = getBySel(nativeElement, 'searchField');
    expect(searchFieldEl).toBeTruthy();

    const carsTable = getBySel(nativeElement, 'carsTable');
    expect(carsTable).toBeTruthy();
  });

  it('if we search by "foo" then the page redirects to ?q=foo', fakeAsync(() => {
    const val = 'foo';
    const nativeElement = fixture.debugElement.nativeElement;
    const searchFieldEl = getBySel(nativeElement, 'searchField');
    const searchButtonEl = getBySel(nativeElement, 'searchButton');
    let router: Router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    searchFieldEl.value = val;
    searchFieldEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    searchButtonEl.click();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/car-list'], {
      queryParams: { q: val },
    });
  }));
});

describe('CarListContainerComponent - through the url/state ?q=foo ', () => {
  let component: CarListContainerComponent;
  let fixture: ComponentFixture<CarListContainerComponent>;
  let httpController: HttpTestingController;
  let httpClient: HttpClient;

  const activatedRouteSpy = {
    queryParams: of({ q: 'foo' }),
    ...jasmine.createSpyObj('ActivatedRoute', ['']),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CarListContainerComponent,
        SearchComponent,
        CarListComponent,
      ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'car-list',
            component: CarListContainerComponent,
          },
        ]),
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteSpy,
        },
      ],
    }).compileComponents();

    httpController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Shows a table with the api response for "foo" and fill the search field with "foo"', fakeAsync(() => {
    const responseCarsApi = [
      { id: 1, name: 'Peugeot 304 SW', brand: 'Peougeot', model: '304' },
      { id: 2, name: 'Peugeot 308 SW', brand: 'Peougeot', model: '308' },
    ];

    const req = httpController.expectOne(`${environment.apiUrl}/cars?q=foo`);
    expect(req.request.method).toEqual('GET');
    req.flush(responseCarsApi);

    fixture.detectChanges();
    const nativeElement = fixture.debugElement.nativeElement;

    const searchFieldEl = getBySel(nativeElement, 'searchField');
    expect(searchFieldEl.value).toBe('foo');

    const carsTableEl = getBySel(nativeElement, 'carsTable');
    const rows = carsTableEl.querySelectorAll('.mat-row');
    expect(rows.length).toBe(responseCarsApi.length);

    rows[0]
      .querySelectorAll('.mat-column-name')
      .forEach((element: any, i: number) => {
        expect(element.textContent).toContain(responseCarsApi[i].name);
      });

    rows[0]
      .querySelectorAll('.mat-column-id')
      .forEach((element: any, i: number) => {
        expect(element.textContent).toContain(responseCarsApi[i].id);
      });
  }));
});

function getBySel(nativeElement: any, id: string) {
  return nativeElement.querySelector(`[data-testid="${id}"]`);
}
