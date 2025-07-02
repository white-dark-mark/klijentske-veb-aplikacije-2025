import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Movie, MovieGenre } from '../../models/cinema/movie.model';
import { NgFor, NgIf } from '@angular/common';
import { SearchService, ProjectionSearchCriteria, ProjectionWithMovie } from '../../services/cinema/search-service';
import { MatButtonModule } from '@angular/material/button';
import { LoadingComponent } from "../loading/loading.component";
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-movies',
  imports: [
    MatTableModule,
    NgIf,
    NgFor,
    MatButtonModule,
    LoadingComponent,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './search-movies.component.html',
  styleUrl: './search-movies.component.css'
})
export class SearchMoviesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['movieTitle', 'genre', 'director', 'dateTime', 'price', 'rating', 'actions'];
  dataSource: ProjectionWithMovie[] | null = null;
  
  // Search criteria
  movieTitle: string = '';
  selectedGenre: MovieGenre | null = null;
  selectedDirector: string | null = null;
  selectedActor: string | null = null;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minRating: number | null = null;
  maxRating: number | null = null;
  
  // Lists for dropdowns
  genreList: MovieGenre[] = [];
  directorList: string[] = [];
  actorList: string[] = [];
  movieTitleList: string[] = [];

  private subscription: Subscription = new Subscription();

  constructor(public searchService: SearchService) {}

  ngOnInit(): void {
    // Subscribe to filtered projections
    this.subscription.add(
      this.searchService.filteredProjections$.subscribe(projections => {
        this.dataSource = projections;
        this.updateSearchLists();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateSearchLists(): void {
    this.genreList = this.searchService.genreList;
    this.directorList = this.searchService.directorList;
    this.actorList = this.searchService.actorList;
    this.movieTitleList = this.searchService.movieTitleList;
  }

  public doReset(): void {
    this.movieTitle = '';
    this.selectedGenre = null;
    this.selectedDirector = null;
    this.selectedActor = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.minRating = null;
    this.maxRating = null;
    this.searchService.doReset();
  }

  public doFilterChain(): void {
    const criteria: ProjectionSearchCriteria = {
      movieTitle: this.movieTitle,
      selectedGenre: this.selectedGenre,
      selectedDirector: this.selectedDirector,
      selectedActor: this.selectedActor,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minRating: this.minRating,
      maxRating: this.maxRating
    };

    this.searchService.doFilterChain(criteria);
  }

  public getGenreDisplayName(genre: MovieGenre): string {
    return this.searchService.getGenreDisplayName(genre);
  }

  public formatDate(date: Date): string {
    return date.toLocaleDateString('en-US');
  }

  public formatDateTime(date: Date): string {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  public formatPrice(price: number): string {
    return `${price.toFixed(2)} RSD`;
  }
} 