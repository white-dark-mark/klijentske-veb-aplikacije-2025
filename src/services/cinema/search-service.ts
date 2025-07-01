import { Injectable } from '@angular/core';
import { Movie, MovieGenre } from '../../models/cinema/movie.model';
import { MovieProjection } from '../../models/cinema/movie-projection.model';
import { MovieService } from './movie.service';
import { Observable, BehaviorSubject, map } from 'rxjs';

export interface ProjectionWithMovie {
  projection: MovieProjection;
  movie: Movie;
}

export interface ProjectionSearchCriteria {
  movieTitle?: string;
  selectedGenre?: MovieGenre | null;
  selectedDirector?: string | null;
  selectedActor?: string | null;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  minPrice?: number | null;
  maxPrice?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private allProjections: ProjectionWithMovie[] = [];
  private filteredProjectionsSubject = new BehaviorSubject<ProjectionWithMovie[]>([]);
  public filteredProjections$ = this.filteredProjectionsSubject.asObservable();

  // Search criteria arrays
  public genreList: MovieGenre[] = [];
  public directorList: string[] = [];
  public actorList: string[] = [];
  public movieTitleList: string[] = [];

  constructor(private movieService: MovieService) {
    this.loadProjections();
  }

  private loadProjections(): void {
    this.movieService.getAll().subscribe(movies => {
      // Flatten all projections from all movies
      const projectionsWithMovies: ProjectionWithMovie[] = [];
      
      movies.forEach(movie => {
        if (movie.projections && movie.projections.length > 0) {
          movie.projections.forEach(projection => {
            projectionsWithMovies.push({
              projection,
              movie
            });
          });
        }
      });

      this.allProjections = projectionsWithMovies;
      this.filteredProjectionsSubject.next(projectionsWithMovies);
      this.generateSearchCriteria(projectionsWithMovies);
    });
  }

  public generateSearchCriteria(source: ProjectionWithMovie[]): void {
    // Extract unique genres
    this.genreList = source.map(item => item.movie.genre)
      .filter((genre: MovieGenre, i: number, ar: MovieGenre[]) => ar.indexOf(genre) === i);

    // Extract unique directors
    this.directorList = source.map(item => item.movie.director)
      .filter((director: string, i: number, ar: string[]) => ar.indexOf(director) === i);

    // Extract unique actors (flatten all actors arrays)
    const allActors = source.flatMap(item => item.movie.actors);
    this.actorList = allActors
      .filter((actor: string, i: number, ar: string[]) => ar.indexOf(actor) === i);

    // Extract unique movie titles
    this.movieTitleList = source.map(item => item.movie.name)
      .filter((title: string, i: number, ar: string[]) => ar.indexOf(title) === i);
  }

  public doReset(): void {
    this.filteredProjectionsSubject.next(this.allProjections);
    this.generateSearchCriteria(this.allProjections);
  }

  public doFilterChain(criteria: ProjectionSearchCriteria): void {
    if (this.allProjections.length === 0) return;

    let filteredData = this.allProjections
      .filter(item => {
        // Movie title search
        if (!criteria.movieTitle || criteria.movieTitle === '') return true;
        const searchTerm = criteria.movieTitle.toLowerCase();
        return item.movie.name.toLowerCase().includes(searchTerm);
      })
      .filter(item => {
        // Genre filter
        if (criteria.selectedGenre == null) return true;
        return item.movie.genre === criteria.selectedGenre;
      })
      .filter(item => {
        // Director filter
        if (criteria.selectedDirector == null) return true;
        return item.movie.director === criteria.selectedDirector;
      })
      .filter(item => {
        // Actor filter
        if (criteria.selectedActor == null) return true;
        return item.movie.actors.includes(criteria.selectedActor);
      })
      .filter(item => {
        // Date from filter
        if (criteria.dateFrom == null) return true;
        return item.projection.dateTime >= criteria.dateFrom;
      })
      .filter(item => {
        // Date to filter
        if (criteria.dateTo == null) return true;
        return item.projection.dateTime <= criteria.dateTo;
      })
      .filter(item => {
        // Min price filter
        if (criteria.minPrice == null) return true;
        return item.projection.price >= criteria.minPrice;
      })
      .filter(item => {
        // Max price filter
        if (criteria.maxPrice == null) return true;
        return item.projection.price <= criteria.maxPrice;
      });

    this.filteredProjectionsSubject.next(filteredData);
    this.generateSearchCriteria(filteredData);
  }

  public getGenreDisplayName(genre: MovieGenre): string {
    const genreNames: { [key in MovieGenre]: string } = {
      [MovieGenre.COMEDY]: 'Comedy',
      [MovieGenre.THRILLER]: 'Thriller',
      [MovieGenre.ACTION]: 'Action',
      [MovieGenre.DRAMA]: 'Drama',
      [MovieGenre.HORROR]: 'Horror',
      [MovieGenre.ROMANCE]: 'Romance',
      [MovieGenre.SCIFI]: 'Sci-Fi',
      [MovieGenre.DOCUMENTARY]: 'Documentary',
      [MovieGenre.ANIMATION]: 'Animation'
    };
    return genreNames[genre] || genre;
  }

  public getFilteredProjections(): ProjectionWithMovie[] {
    return this.filteredProjectionsSubject.value;
  }
}
