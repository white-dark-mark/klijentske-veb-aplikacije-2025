import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MovieReview } from '../../models/cinema/movie-review.model';

@Injectable({
  providedIn: 'root'
})
export class MovieReviewService {
  private static lastReviewId = 1;

  private static retrieveReviews(): MovieReview[] {
    if (!localStorage.getItem('movieReviews')) {
      const initialReviews: MovieReview[] = [
        {
          id: 1,
          userId: 1,
          movieId: 1,
          reviewText: 'Mind-bending plot with amazing visual effects. Christopher Nolan at his best!',
          rating: 5,
          createdAt: new Date('2024-03-15')
        },
        {
          id: 2,
          userId: 2,
          movieId: 1,
          reviewText: 'Complex but rewarding. Multiple viewings required.',
          rating: 4,
          createdAt: new Date('2024-03-16')
        },
        {
          id: 3,
          userId: 3,
          movieId: 2,
          reviewText: 'A timeless masterpiece. Morgan Freeman\'s narration is perfect.',
          rating: 5,
          createdAt: new Date('2024-03-14')
        },
        {
          id: 4,
          userId: 4,
          movieId: 3,
          reviewText: 'Heath Ledger\'s Joker is legendary. Best superhero movie ever.',
          rating: 5,
          createdAt: new Date('2024-03-17')
        },
        {
          id: 5,
          userId: 5,
          movieId: 1,
          reviewText: 'The special effects are great but the story is confusing.',
          rating: 3,
          createdAt: new Date('2024-03-18')
        }
      ];

      localStorage.setItem('movieReviews', JSON.stringify(initialReviews));
      MovieReviewService.lastReviewId = initialReviews.length + 1;
    }

    const reviews = JSON.parse(localStorage.getItem('movieReviews')!);
    // Convert string dates back to Date objects
    return reviews.map((review: MovieReview) => ({
      ...review,
      createdAt: new Date(review.createdAt)
    }));
  }

  getAll(): Observable<MovieReview[]> {
    return of(MovieReviewService.retrieveReviews());
  }

  getByMovieId(movieId: number): Observable<MovieReview[]> {
    const reviews = MovieReviewService.retrieveReviews();
    return of(reviews.filter(review => review.movieId === movieId));
  }

  getByUserId(userId: number): Observable<MovieReview[]> {
    const reviews = MovieReviewService.retrieveReviews();
    return of(reviews.filter(review => review.userId === userId));
  }

  create(review: MovieReview): Observable<MovieReview> {
    const reviews = MovieReviewService.retrieveReviews();
    review.id = MovieReviewService.lastReviewId++;
    review.createdAt = new Date();
    
    reviews.push(review);
    localStorage.setItem('movieReviews', JSON.stringify(reviews));
    
    return of(review);
  }

  update(id: number, review: MovieReview): Observable<MovieReview> {
    const reviews = MovieReviewService.retrieveReviews();
    const index = reviews.findIndex(r => r.id === id);
    
    if (index !== -1) {
      reviews[index] = { ...review, id };
      localStorage.setItem('movieReviews', JSON.stringify(reviews));
      return of(reviews[index]);
    }
    
    return of(review);
  }

  delete(id: number): Observable<void> {
    const reviews = MovieReviewService.retrieveReviews();
    const filteredReviews = reviews.filter(review => review.id !== id);
    localStorage.setItem('movieReviews', JSON.stringify(filteredReviews));
    return of(void 0);
  }

  // New method to check if user has already reviewed a movie
  hasUserReviewedMovie(userId: number, movieId: number): Observable<boolean> {
    const reviews = MovieReviewService.retrieveReviews();
    return of(reviews.some(review => review.userId === userId && review.movieId === movieId));
  }
} 