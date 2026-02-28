import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./features/specialists/pages/specialists-list/specialists-list.component').then(m => m.SpecialistsListComponent) },
];
