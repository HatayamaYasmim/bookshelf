import { Component, inject, OnInit } from '@angular/core';

import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../models/book.model';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-book-list',
  imports: [
    HlmTableImports,
    HlmBadgeImports,
    HlmButtonImports,
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
})
export class BookListComponent implements OnInit {
  private readonly bookService = inject(BookService);

  books: Book[] = [];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.findAll().subscribe({
      next: (books) => {
        this.books = books;
      },
      error: (error) => {
        console.error('Error loading books:', error);
      },
    });
  }
}