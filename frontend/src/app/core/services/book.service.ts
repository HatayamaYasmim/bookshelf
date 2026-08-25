import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../../models/book.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
private readonly http = inject(HttpClient)

private readonly apiURL = `${environment.apiUrl}/books`;

findAll(): Observable<Book[]> {
  return this.http.get<Book[]>(this.apiURL)
}
}
