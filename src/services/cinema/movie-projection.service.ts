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
      dateTime: new Date('2024-03-20T20:00:00'),
      price: 800
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