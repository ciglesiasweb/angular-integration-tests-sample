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
        SearchComponent, // Si.. necesitamos también compilar esta componente. Es un test de integración!
        CarListComponent, // Si.. necesitamos también compilar esta componente. Es un test de integración!
      ],
      imports: [
        NoopAnimationsModule, // Necesaria para que las animaciones no nos hagan ruido en los tests.
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: 'car-list',
            component: CarListContainerComponent,
          },
        ]),
        MatInputModule, //Añadimos los módulos material que usa la operativa
        MatFormFieldModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        MatProgressSpinnerModule,
      ],
    }).compileComponents(); // 🤠 Nos ha compilado las componentes que interactúan!
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

  // 🤓 El siguiente test usa fakeAsync ya que usa tick(). Es para comportamientos asíncronos.
  it('if we search by "foo" then the page redirects to ?q=foo', fakeAsync(() => {
    const val = 'foo';
    const nativeElement = fixture.debugElement.nativeElement;
    const searchFieldEl = getBySel(nativeElement, 'searchField');
    const searchButtonEl = getBySel(nativeElement, 'searchButton');
    let router: Router = TestBed.inject(Router); // 🤓 nos traemos el Router del mecanismo de inyección de dependencias.
    spyOn(router, 'navigate'); // 🧐 Espiamos el método navigate del router de angular

    searchFieldEl.value = val;
    searchFieldEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    searchButtonEl.click(); // 🔨 actuamos  (Para saber mas busca Patrón AAA Testing) -  Arrange Act Assert.
    tick(); // simulamos que ha pasado un tiempo.
    expect(router.navigate).toHaveBeenCalledWith(['/car-list'], {
      queryParams: { q: val },
    });
  }));
});

/**
 * Nos hemos generado este segundo describe porque simoulamos que estamos en la ruta ?q=foo
 * y necesitamos de una configuración "ActivatedRoute"  que no deseamos que esté en los casos del describe anterior.

 */

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
          useValue: activatedRouteSpy, // 🤓 cuando se consulte en que url estamos usamos este espía.
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
      { id: 1, name: 'Peugeot 304 SW', brand: 'Peougeot', model: '304' }, //🚗
      { id: 2, name: 'Peugeot 308 SW', brand: 'Peougeot', model: '308' }, // 🚙
    ];

    const req = httpController.expectOne(`${environment.apiUrl}/cars?q=foo`); // Assert de que llamamos al api con la url que espeamos
    expect(req.request.method).toEqual('GET');
    req.flush(responseCarsApi); // ordenamos que el api nos devuelva los [🚗, 🚙]

    fixture.detectChanges(); // importante. decimos a la compoenente que detecte los cambios.
    const nativeElement = fixture.debugElement.nativeElement;

    const searchFieldEl = getBySel(nativeElement, 'searchField');
    expect(searchFieldEl.value).toBe('foo');

    const nativeTableEl = getBySel(nativeElement, 'carsTable');

    // 😃 aquí empezamos a comprobar que la tabla muestra los datos esperados.
    const rows = nativeTableEl.querySelectorAll('.mat-row');
    expect(rows.length)
      .withContext(' has num rows')
      .toBe(responseCarsApi.length);

    rows.forEach((row: any, i: number) => {
      expect(row.querySelector('.mat-column-name').textContent)
        .withContext('column name contains')
        .toContain(responseCarsApi[i].name);

      expect(row.querySelector('.mat-column-id').textContent)
        .withContext('column id contains')
        .toContain(responseCarsApi[i].id);
    });
  }));
});

// 🤓 utilidad para acceder a elementos
function getBySel(nativeElement: any, id: string) {
  return nativeElement.querySelector(`[data-testid="${id}"]`);
}
