import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FlightModel } from '../../models/flight.model';
import { NgFor, NgIf } from '@angular/common';
import { FlightService } from '../../services/flight.service';
import { MatButtonModule } from '@angular/material/button';
import { UtilsService } from '../../services/utils.service';
import { LoadingComponent } from "../loading/loading.component";
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-search',
  imports: [
    MatTableModule,
    NgIf,
    NgFor,
    MatButtonModule,
    LoadingComponent,
    RouterLink,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatSelectModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  displayedColumns: string[] = ['id', 'destination', 'flightNumber', 'scheduledAt', 'actions'];
  allData: FlightModel[] | null = null
  destinationList: string[] = []
  selectedDestination: string | null = null
  dataSource: FlightModel[] | null = null

  public constructor(public utils: UtilsService) {
    FlightService.getFlightList()
      .then(rsp => {
        this.allData = rsp.data
        this.dataSource = rsp.data
        this.destinationList = rsp.data.map((obj: FlightModel) => obj.destination)
      })
  }

  public doSearch(e: any) {
    const input = e.target.value
    if (this.allData == null) return

    if (input == '') {
      this.dataSource = this.allData
      return
    }

    this.dataSource = this.allData
      .filter(obj => {
        return obj.destination.toLowerCase().includes(input) || obj.id.toString().includes(input) || obj.flightNumber.includes(input)
      })
  }

  public doSelectDestination(e: any) {
    this.dataSource = this.allData!.filter(obj=>obj.destination === this.selectedDestination)
  }
}
