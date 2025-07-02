import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UserModel } from '../../models/user.model';
import { MatTableModule } from '@angular/material/table';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CartItemService } from '../../services/cinema/cart-item.service';
import { MovieService } from '../../services/cinema/movie.service';
import { MovieProjectionService } from '../../services/cinema/movie-projection.service';
import { MovieReviewService } from '../../services/cinema/movie-review.service';
import { CartItem, CartItemStatus } from '../../models/cinema/cart-item.model';
import { Movie } from '../../models/cinema/movie.model';
import { MovieProjection } from '../../models/cinema/movie-projection.model';
import { MovieReview } from '../../models/cinema/movie-review.model';
import { FlightService } from '../../services/flight.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  imports: [
    NgIf,
    NgFor,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    RouterLink,
    MatExpansionModule,
    MatAccordion,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  public displayedColumns: string[] = ['movie', 'projection', 'dateTime', 'price', 'status', 'rating', 'actions'];
  public user: UserModel | null = null
  public userCopy: UserModel | null = null
  public destinationList: string[] = []
  public cartItems: CartItem[] = []
  public cartItemsWithDetails: any[] = []
  public totalPrice: number = 0

  public oldPasswordValue = ''
  public newPasswordValue = ''
  public repeatPasswordValue = ''

  constructor(
    private router: Router,
    private cartService: CartItemService,
    private movieService: MovieService,
    private projectionService: MovieProjectionService,
    private movieReviewService: MovieReviewService,
    private snackBar: MatSnackBar
  ) {
    if (!UserService.getActiveUser()) {
      // Korisnik aplikacije nije ulogovan
      // Vrati korisnika na homepage
      router.navigate(['/home'])
      return
    }

    this.user = UserService.getActiveUser()
    this.userCopy = UserService.getActiveUser()
    FlightService.getDestinations()
      .then(rsp => this.destinationList = rsp.data)
  }

  ngOnInit(): void {
    this.loadUserCart();
  }

  private loadUserCart(): void {
    if (!this.user) return;
    
    this.cartService.getByUserId(this.user.id).subscribe(cartItems => {
      this.cartItems = cartItems;
      this.loadCartItemsWithDetails();
    });
  }

  private loadCartItemsWithDetails(): void {
    this.cartItemsWithDetails = [];
    let totalPrice = 0;

    this.cartItems.forEach(cartItem => {
      this.projectionService.getById(cartItem.projectionId).subscribe(projection => {
        if (projection) {
          this.movieService.getById(projection.movieId).subscribe(movie => {
            if (movie) {
              const itemWithDetails = {
                cartItem: cartItem,
                movie: movie,
                projection: projection
              };
              this.cartItemsWithDetails.push(itemWithDetails);
              totalPrice += projection.price;
              this.totalPrice = totalPrice;
            }
          });
        }
      });
    });
  }

  public doChangePassword() {
    if (this.oldPasswordValue == '' || this.newPasswordValue == null) {
      alert('Password cant be empty')
      return
    }

    if (this.newPasswordValue !== this.repeatPasswordValue) {
      alert('Password dont match')
      return
    }

    if (this.oldPasswordValue !== this.user?.password) {
      alert('Password dont match')
      return
    }

    alert(
      UserService.changePassword(this.newPasswordValue) ?
        'Password has been changed' : 'Failed to change password'
    )

    this.oldPasswordValue = ''
    this.newPasswordValue = ''
    this.repeatPasswordValue = ''
  }

  public doUpdateUser() {
    if (this.userCopy == null) {
      alert('User not defined')
      return
    }

    UserService.updateUser(this.userCopy)
    this.user = UserService.getActiveUser()
    alert('User was updated')
  }

  public markAsWatched(cartItem: CartItem): void {
    this.cartService.updateStatus(cartItem.id, CartItemStatus.WATCHED).subscribe(() => {
      this.snackBar.open('Projekcija označena kao gledana', 'Zatvori', { duration: 3000 });
      this.loadUserCart();
    });
  }

  public cancelProjection(cartItem: CartItem): void {
    this.cartService.updateStatus(cartItem.id, CartItemStatus.CANCELLED).subscribe(() => {
      this.snackBar.open('Projekcija je otkazana', 'Zatvori', { duration: 3000 });
      this.loadUserCart();
    });
  }

  public deleteFromCart(cartItem: CartItem): void {
    if (this.canDelete(cartItem.status)) {
      this.cartService.delete(cartItem.id).subscribe(() => {
        this.snackBar.open('Projekcija uklonjena iz korpe', 'Zatvori', { duration: 3000 });
        this.loadUserCart();
      });
    }
  }

  public rateProjection(cartItem: CartItem, rating: number): void {
    if (!this.canRate(cartItem.status) || !this.user) return;

    // Find the movie for this projection
    const cartItemWithDetails = this.cartItemsWithDetails.find(item => item.cartItem.id === cartItem.id);
    if (!cartItemWithDetails) return;

    const movie = cartItemWithDetails.movie;

    // Check if user already has a review for this movie
    this.movieReviewService.hasUserReviewedMovie(this.user.id, movie.id).subscribe(hasReviewed => {
      if (hasReviewed) {
        // Ask if user wants to update existing review
        this.showUpdateExistingReviewDialog(cartItem, movie, rating);
      } else {
        // Show dialog to get review comment
        this.showReviewDialog(cartItem, movie, rating);
      }
    });
  }

  private updateProjectionRating(cartItem: CartItem, rating: number): void {
    this.cartService.rateProjection(cartItem.id, rating).subscribe(() => {
      this.snackBar.open(`Ocenili ste projekciju sa ${rating} zvezda`, 'Zatvori', { duration: 3000 });
      this.loadUserCart();
    });
  }

  private showReviewDialog(cartItem: CartItem, movie: Movie, rating: number): void {
    Swal.fire({
      title: `Ocenite film: ${movie.name}`,
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Ocena:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
          <label for="review-comment" style="display: block; margin-bottom: 8px;">Dodajte komentar (opciono):</label>
          <textarea 
            id="review-comment" 
            placeholder="Opišite vaše iskustvo sa filmom..."
            style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"
          ></textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Potvrdi ocenu',
      cancelButtonText: 'Otkaži',
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const commentElement = document.getElementById('review-comment') as HTMLTextAreaElement;
        return {
          comment: commentElement.value.trim()
        };
      }
    }).then((result) => {
      if (result.isConfirmed && this.user) {
        const reviewText = result.value.comment || `Ocena za projekciju filma ${movie.name}`;
        
        // Create movie review
        const movieReview: MovieReview = {
          id: 0, // Will be set by service
          userId: this.user.id,
          movieId: movie.id,
          reviewText: reviewText,
          rating: rating,
          createdAt: new Date()
        };

        this.movieReviewService.create(movieReview).subscribe(() => {
          // Update projection rating
          this.updateProjectionRating(cartItem, rating);
          this.snackBar.open(`Uspešno ste ocenili film "${movie.name}" sa ${rating} zvezda!`, 'Zatvori', { duration: 4000 });
        });
      }
    });
  }

  public getStarRating(rating?: number): string {
    if (!rating) return '☆☆☆☆☆';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  public canModify(status: CartItemStatus | string): boolean {
    return status === CartItemStatus.BOOKED || status === 'BOOKED' || status === 'rezervisano';
  }

  public canDelete(status: CartItemStatus | string): boolean {
    return status === CartItemStatus.WATCHED || status === 'WATCHED' || status === 'gledano';
  }

  public canRate(status: CartItemStatus | string): boolean {
    return status === CartItemStatus.WATCHED || status === 'WATCHED' || status === 'gledano';
  }

  private showUpdateExistingReviewDialog(cartItem: CartItem, movie: Movie, rating: number): void {
    Swal.fire({
      title: 'Već imate recenziju za ovaj film',
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p>Već ste recenzirali film "<strong>${movie.name}</strong>".</p>
          <p>Nova ocena: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
          <p>Da li želite da:</p>
          <div style="margin: 15px 0;">
            <button id="update-review-btn" style="margin: 5px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Ažuriram postojeću recenziju
            </button>
            <br>
            <button id="just-rate-btn" style="margin: 5px; padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Samo ocenim projekciju
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Otkaži',
      didOpen: () => {
        const updateBtn = document.getElementById('update-review-btn');
        const rateBtn = document.getElementById('just-rate-btn');
        
        updateBtn?.addEventListener('click', () => {
          Swal.close();
          this.updateExistingReview(cartItem, movie, rating);
        });
        
        rateBtn?.addEventListener('click', () => {
          Swal.close();
          this.updateProjectionRating(cartItem, rating);
        });
      }
    });
  }

  private updateExistingReview(cartItem: CartItem, movie: Movie, rating: number): void {
    if (!this.user) return;

    // Get existing review
    this.movieReviewService.getByUserId(this.user.id).subscribe(userReviews => {
      const existingReview = userReviews.find(review => review.movieId === movie.id);
      
      if (existingReview) {
        Swal.fire({
          title: `Ažurirajte recenziju za: ${movie.name}`,
          html: `
            <div style="text-align: left; margin: 20px 0;">
              <p><strong>Nova ocena:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
              <label for="review-comment" style="display: block; margin-bottom: 8px;">Ažurirajte komentar:</label>
              <textarea 
                id="review-comment" 
                placeholder="Ažurirajte svoj komentar..."
                style="width: 100%; height: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"
              >${existingReview.reviewText}</textarea>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Ažuriraj recenziju',
          cancelButtonText: 'Otkaži',
          confirmButtonColor: '#4CAF50',
          preConfirm: () => {
            const commentElement = document.getElementById('review-comment') as HTMLTextAreaElement;
            return {
              comment: commentElement.value.trim()
            };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const updatedReview = {
              ...existingReview,
              rating: rating,
              reviewText: result.value.comment || existingReview.reviewText
            };

            this.movieReviewService.update(existingReview.id, updatedReview).subscribe(() => {
              this.updateProjectionRating(cartItem, rating);
              this.snackBar.open(`Ažurirali ste recenziju za "${movie.name}"!`, 'Zatvori', { duration: 4000 });
            });
          }
        });
      }
    });
  }
}
