import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/cinema/movie.service';
import { Movie } from '../../models/cinema/movie.model';
import { MovieProjection } from '../../models/cinema/movie-projection.model';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getAll().subscribe(movies => {
      this.movies = movies;
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
} 