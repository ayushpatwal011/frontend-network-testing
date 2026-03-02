import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TowerDetailComponent } from './components/tower-detail/tower-detail';
import { SpeedTesterComponent } from './components/speed-tester/speed-tester';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'tower/:id', component: TowerDetailComponent },
    { path: 'speed-test', component: SpeedTesterComponent },
    { path: 'speed-test/:id', component: SpeedTesterComponent }
];
