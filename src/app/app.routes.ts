import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/transaction-simulator/transaction-simulator-page').then(
        (m) => m.TransactionSimulatorPage,
      ),
  },
];
