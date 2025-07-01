import { MovieProjection } from './movie-projection.model';

export enum MovieGenre {
  COMEDY = 'comedy',
  THRILLER = 'thriller',
  ACTION = 'action',
  DRAMA = 'drama',
  HORROR = 'horror',
  ROMANCE = 'romance',
  SCIFI = 'sci-fi',
  DOCUMENTARY = 'documentary',
  ANIMATION = 'animation'
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
