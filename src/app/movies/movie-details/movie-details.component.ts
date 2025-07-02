import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../../services/cinema/movie.service';
import { MovieReviewService } from '../../../services/cinema/movie-review.service';
import { CartItemService } from '../../../services/cinema/cart-item.service';
import { UserService } from '../../../services/user.service';
import { Movie } from '../../../models/cinema/movie.model';
import { MovieProjection } from '../../../models/cinema/movie-projection.model';
import { MovieReview } from '../../../models/cinema/movie-review.model';
import { CartItemStatus } from '../../../models/cinema/cart-item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterLink],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie?: Movie;
  projection?: MovieProjection;
  reviews: MovieReview[] = [];
  averageRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private reviewService: MovieReviewService,
    private cartService: CartItemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('movieId'));
    const projectionId = Number(this.route.snapshot.paramMap.get('projectionId'));

    this.movieService.getById(movieId).subscribe(movie => {
      this.movie = movie;
      if (movie?.projections) {
        this.projection = movie.projections.find(p => p.id === projectionId);
      }
    });

    this.reviewService.getByMovieId(movieId).subscribe(reviews => {
      this.reviews = reviews;
      this.calculateAverageRating();
    });
  }

  private calculateAverageRating(): void {
    if (this.reviews.length === 0) return;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
  }

  getStarRating(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  isUserLoggedIn(): boolean {
    return UserService.getActiveUser() !== null;
  }

  bookProjection(): void {
    Swal.fire({
      title: `Place an order to ${this.movie?.name}?`,
      text: "Orders can be canceled any time from your user profile!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        popup: 'bg-dark'
      },
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, place an order!"
    }).then((result) => {
      if (!result.isConfirmed) {
        // User cancelled, just return without error message
        return;
      }
    const user = UserService.getActiveUser();
    if (!user) {
      this.snackBar.open('Please log in to book tickets', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/login']);
      return;
    }

    if (!this.projection) {
      this.snackBar.open('Error: Projection not found', 'Close', {
        duration: 3000
      });
      return;
    }

    const cartItem = {
      id: 0, // Will be set by service
      userId: user.id,
      projectionId: this.projection.id,
      status: CartItemStatus.BOOKED
    };

    this.cartService.create(cartItem).subscribe({
      next: (createdItem) => {
        this.snackBar.open('Uspešno dodato u korpu!', 'Zatvori', {
          duration: 3000
        });
        // Navigate to user profile to see the cart
        this.router.navigate(['/user']);
      },
      error: (error) => {
        this.snackBar.open('Greška pri dodavanju u korpu', 'Zatvori', {
          duration: 3000
        });
        }
      });
    });
  }
} 