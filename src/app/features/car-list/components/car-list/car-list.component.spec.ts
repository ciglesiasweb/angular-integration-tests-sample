import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CarListComponent } from './car-list.component';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { CarApiService } from 'src/app/features/services/car.service';
describe('CarListComponent', () => {
  let component: CarListComponent;
  let fixture: ComponentFixture<CarListComponent>;
  let listSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    const carApiService = jasmine.createSpyObj('carApiService', ['list']);
    listSpy = carApiService.list;

    TestBed.configureTestingModule({
      declarations: [CarListComponent],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatProgressSpinnerModule,
      ],
      providers: [{ provide: CarApiService, useValue: carApiService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarListComponent);
    component = fixture.componentInstance;
  });

  it('should paint a tabla with the api response', () => {
    const responseCarsApi = [
      { id: 1, name: 'Peugeot 304 SW', brand: 'Peougeot', model: '304' },
      { id: 2, name: 'Peugeot 308 SW', brand: 'Peougeot', model: '308' },
    ];

    const q$ = cold('---x|', { x: responseCarsApi });
    listSpy.and.returnValue(q$);
    fixture.detectChanges();
    const nativeElement = fixture.debugElement.nativeElement;
    expect(getBySel(nativeElement, 'loader'))
      .withContext('shows loader')
      .toBeTruthy();

    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    const nativeTableEl = getBySel(nativeElement, 'carsTable');
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
  });

  it('should show a message with no data if api returns empty array', () => {
    const q$ = cold('---x|', { x: [] });
    listSpy.and.returnValue(q$);
    fixture.detectChanges();
    const nativeElement = fixture.debugElement.nativeElement;
    expect(getBySel(nativeElement, 'loader'))
      .withContext('shows loader')
      .toBeTruthy();

    getTestScheduler().flush(); // flush the observables
    fixture.detectChanges();

    expect(getBySel(nativeElement, 'no-data'))
      .withContext('shows no data span')
      .toBeTruthy();
  });
});

function getBySel(nativeElement: any, id: string) {
  return nativeElement.querySelector(`[data-testid="${id}"]`);
}
