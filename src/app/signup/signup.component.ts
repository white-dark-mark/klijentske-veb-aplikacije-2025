import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserRole } from '../../models/user.model';
import { MovieGenre } from '../../models/cinema/movie.model';

@Component({
  selector: 'app-signup',
  imports: [MatCardModule, NgFor, RouterLink, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatSelectModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public genreList: {value: MovieGenre, label: string}[] = [
    { value: MovieGenre.ACTION, label: 'Action' },
    { value: MovieGenre.ANIMATION, label: 'Animation' },
    { value: MovieGenre.COMEDY, label: 'Comedy' },
    { value: MovieGenre.DOCUMENTARY, label: 'Documentary' },
    { value: MovieGenre.DRAMA, label: 'Drama' },
    { value: MovieGenre.HORROR, label: 'Horror' },
    { value: MovieGenre.ROMANCE, label: 'Romance' },
    { value: MovieGenre.SCIFI, label: 'Sci-Fi' },
    { value: MovieGenre.THRILLER, label: 'Thriller' }
  ]
  public email = ''
  public password = ''
  public repeatPassword = ''
  public firstName = ''
  public lastName = ''
  public phone = ''
  public address = ''
  public favoriteGenre: MovieGenre | '' = ''

  public constructor(private router: Router) {
  }

  public doSignup() {
    if (this.email == '' || this.password == '') {
      alert('Email and password are required fields')
      return
    }

    if (this.password !== this.repeatPassword) {
      alert('Passwords dont match')
      return
    }

    const result = UserService.createUser({
      id: 1, 
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      address: this.address,
      favouriteGenre: this.favoriteGenre,
      role: UserRole.WATCHER, // Will be overridden by UserService.createUser
      orders: []
    })

    result ? this.router.navigate(['/login']) : alert('Email is already taken')
  }
}
