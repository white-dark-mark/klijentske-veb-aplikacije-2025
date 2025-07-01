import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Movie, MovieGenre } from '../../models/cinema/movie.model';
import { MovieProjection } from '../../models/cinema/movie-projection.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movieProjections: MovieProjection[] = [
    {
      id: 1,
      movieId: 1,
      dateTime: new Date('2024-03-20T18:00:00'),
      price: 800
    },
    {
      id: 2,
      movieId: 1,
      dateTime: new Date('2024-03-20T20:30:00'),
      price: 800
    },
    {
      id: 3,
      movieId: 2,
      dateTime: new Date('2024-03-21T19:00:00'),
      price: 750
    },
    {
      id: 4,
      movieId: 3,
      dateTime: new Date('2024-03-21T21:00:00'),
      price: 850
    }
  ];

  private movies: Movie[] = [
    {
      id: 1,
      name: 'Inception',
      genre: MovieGenre.SCIFI,
      director: 'Christopher Nolan',
      duration: 148,
      actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
      releaseDate: new Date('2010-07-16'),
      projections: [] // Will be populated in constructor
    },
    {
      id: 2,
      name: 'The Shawshank Redemption',
      genre: MovieGenre.DRAMA,
      director: 'Frank Darabont',
      duration: 142,
      actors: ['Tim Robbins', 'Morgan Freeman'],
      releaseDate: new Date('1994-09-23')
    },
    {
      id: 3,
      name: 'The Dark Knight',
      genre: MovieGenre.ACTION,
      director: 'Christopher Nolan',
      duration: 152,
      actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
      releaseDate: new Date('2008-07-18')
    },
    {
      id: 4,
      name: 'Pulp Fiction',
      genre: MovieGenre.THRILLER,
      director: 'Quentin Tarantino',
      duration: 154,
      actors: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman'],
      releaseDate: new Date('1994-10-14')
    },
    {
      id: 5,
      name: 'The Matrix',
      genre: MovieGenre.SCIFI,
      director: 'The Wachowskis',
      duration: 136,
      actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
      releaseDate: new Date('1999-03-31')
    },
    {
      id: 6,
      name: 'Forrest Gump',
      genre: MovieGenre.DRAMA,
      director: 'Robert Zemeckis',
      duration: 142,
      actors: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
      releaseDate: new Date('1994-07-06')
    },
    {
      id: 7,
      name: 'Toy Story',
      genre: MovieGenre.ANIMATION,
      director: 'John Lasseter',
      duration: 81,
      actors: ['Tom Hanks', 'Tim Allen'],
      releaseDate: new Date('1995-11-22')
    },
    {
      id: 8,
      name: 'The Silence of the Lambs',
      genre: MovieGenre.THRILLER,
      director: 'Jonathan Demme',
      duration: 118,
      actors: ['Jodie Foster', 'Anthony Hopkins'],
      releaseDate: new Date('1991-02-14')
    },
    {
      id: 9,
      name: 'When Harry Met Sally',
      genre: MovieGenre.ROMANCE,
      director: 'Rob Reiner',
      duration: 96,
      actors: ['Billy Crystal', 'Meg Ryan'],
      releaseDate: new Date('1989-07-21')
    },
    {
      id: 10,
      name: 'The Hangover',
      genre: MovieGenre.COMEDY,
      director: 'Todd Phillips',
      duration: 100,
      actors: ['Bradley Cooper', 'Ed Helms', 'Zach Galifianakis'],
      releaseDate: new Date('2009-06-05')
    }
  ];

  constructor() {
    // Populate projections for each movie
    this.movies = this.movies.map(movie => ({
      ...movie,
      projections: this.movieProjections.filter(p => p.movieId === movie.id)
    }));
  }

  getAll(): Observable<Movie[]> {
    return of(this.movies);
  }

  getById(id: number): Observable<Movie | undefined> {
    return of(this.movies.find(movie => movie.id === id));
  }

  getMovieProjections(movieId: number): Observable<MovieProjection[]> {
    return of(this.movieProjections.filter(p => p.movieId === movieId));
  }

  create(movie: Movie): Observable<Movie> {
    movie.id = this.movies.length + 1;
    this.movies.push(movie);
    return of(movie);
  }

  update(id: number, movie: Movie): Observable<Movie> {
    const index = this.movies.findIndex(m => m.id === id);
    if (index !== -1) {
      this.movies[index] = { ...movie, id };
      return of(this.movies[index]);
    }
    return of(movie);
  }

  delete(id: number): Observable<void> {
    this.movies = this.movies.filter(movie => movie.id !== id);
    return of(void 0);
  }

  // New method to add a projection
  addProjection(projection: MovieProjection): Observable<MovieProjection> {
    projection.id = this.movieProjections.length + 1;
    this.movieProjections.push(projection);
    
    // Update the movie's projections array
    const movie = this.movies.find(m => m.id === projection.movieId);
    if (movie && movie.projections) {
      movie.projections.push(projection);
    }
    
    return of(projection);
  }

  // New method to remove a projection
  removeProjection(projectionId: number): Observable<void> {
    const projection = this.movieProjections.find(p => p.id === projectionId);
    if (projection) {
      // Remove from movieProjections array
      this.movieProjections = this.movieProjections.filter(p => p.id !== projectionId);
      
      // Remove from movie's projections array
      const movie = this.movies.find(m => m.id === projection.movieId);
      if (movie && movie.projections) {
        movie.projections = movie.projections.filter(p => p.id !== projectionId);
      }
    }
    return of(void 0);
  }
} 