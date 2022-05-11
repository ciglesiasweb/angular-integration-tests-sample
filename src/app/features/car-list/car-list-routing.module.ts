import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarListContainerComponent } from './containers/car-list-container/car-list-container.component';

const routes: Routes = [{ path: '', component: CarListContainerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarListRoutingModule {}
