import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MovieProjection } from '../../models/cinema/movie-projection.model';

@Injectable({
  providedIn: 'root'
})
export class MovieProjectionService {
  private projections: MovieProjection[] = [
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
    },
    {
      id: 5,
      movieId: 4,
      dateTime: new Date('2024-03-22T18:30:00'),
      price: 900
    },
    {
      id: 6,
      movieId: 5,
      dateTime: new Date('2024-03-22T20:45:00'),
      price: 800
    },
    {
      id: 7,
      movieId: 6,
      dateTime: new Date('2024-03-23T17:00:00'),
      price: 700
    },
    {
      id: 8,
      movieId: 7,
      dateTime: new Date('2024-03-23T19:15:00'),
      price: 600
    }
  ];

  getAll(): Observable<MovieProjection[]> {
    return of(this.projections);
  }

  getById(id: number): Observable<MovieProjection | undefined> {
    return of(this.projections.find(p => p.id === id));
  }

  create(projection: MovieProjection): Observable<MovieProjection> {
    projection.id = this.projections.length + 1;
    this.projections.push(projection);
    return of(projection);
  }

  update(id: number, projection: MovieProjection): Observable<MovieProjection> {
    const index = this.projections.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projections[index] = { ...projection, id };
      return of(this.projections[index]);
    }
    return of(projection);
  }

  delete(id: number): Observable<void> {
    this.projections = this.projections.filter(p => p.id !== id);
    return of(void 0);
  }
} 