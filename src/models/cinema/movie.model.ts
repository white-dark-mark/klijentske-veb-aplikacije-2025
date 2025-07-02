import { MovieProjection } from './movie-projection.model';

export enum MovieGenre {
  COMEDY = 'Comedy',
  THRILLER = 'Thriller',
  ACTION = 'Action',
  DRAMA = 'Drama',
  HORROR = 'Horror',
  ROMANCE = 'Romance',
  SCIFI = 'Sci-Fi',
  DOCUMENTARY = 'Documentary',
  ANIMATION = 'Animation'
}

export interface Movie {
  id: number;
  genre: MovieGenre;
  name: string;
  actors: string[];
  director: string;
  duration: number; // in minutes
  releaseDate: Date;
  projections?: MovieProjection[]; // Adding optional projections array
}
