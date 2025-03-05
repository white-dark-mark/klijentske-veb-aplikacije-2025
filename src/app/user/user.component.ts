import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { OrderModel } from '../../models/order.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-user',
  imports: [NgIf, NgFor],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  public orders: OrderModel[] = []

  constructor(private router: Router) {
    if (!UserService.getActiveUser()) {
      // Korisnik aplikacije nije ulogovan
      // Vrati korisnika na homepage
      router.navigate(['/home'])
      return
    }

    this.orders = UserService.getActiveUser()!.orders
  }
}
