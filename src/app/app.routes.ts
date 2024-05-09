import { Routes } from '@angular/router';
import { ParkingComponent } from './pages/parking/parking.component';
import { ParkingLotComponent } from './pages/parking-lot/parking-lot.component';

export const routes: Routes = [
   {
    path: '',
        redirectTo: '/home',
        pathMatch: 'full'
   },
   {
    path:'home',
    component:ParkingComponent
   },
   {
    path:'parking-lot',
    component:ParkingLotComponent
   }

];
