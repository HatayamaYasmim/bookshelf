import { Routes } from '@angular/router';

import { BookListComponent } from './features/books/book-list/book-list.component';

export const routes: Routes = [
  {
    path: 'books',
    component: BookListComponent,
  },
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full',
  },
];