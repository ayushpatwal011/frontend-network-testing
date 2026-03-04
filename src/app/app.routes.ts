import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { TowerDetailComponent } from './components/tower-detail/tower-detail';
import { SpeedTesterComponent } from './components/speed-tester/speed-tester';
import { TowersList } from './components/towers-list/towers-list';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'towers', component: TowersList },
    { path: 'tower/:id', component: TowerDetailComponent },
    { path: 'speed-test', component: SpeedTesterComponent },
    { path: 'speed-test/:id', component: SpeedTesterComponent }
];
