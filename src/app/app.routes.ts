import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';
import { AirlineComponent } from './airline/airline.component';
import { DetailsComponent } from './details/details.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { OrderComponent } from './order/order.component';
import { SignupComponent } from './signup/signup.component';
import { MoviesComponent } from './movies/movies.component';
import { SearchMoviesComponent } from './search-movies/search-movies.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'search', component: SearchMoviesComponent },
    { path: 'airlines', component: AirlineComponent },
    { path: 'details/:id/order', component: OrderComponent },
    { path: 'details/:id', component: DetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'user', component: UserComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'movies', component: MoviesComponent },
    { path: 'movies/:movieId/projections/:projectionId', loadComponent: () => import('./movies/movie-details/movie-details.component').then(m => m.MovieDetailsComponent) },
    { path: '**', redirectTo: '' }
]
