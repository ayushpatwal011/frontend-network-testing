import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { Tower } from '../../models/tower.model';

@Component({
  selector: 'app-towers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './towers-list.html',
  styleUrl: './towers-list.css',
})
export class TowersList implements OnInit {
  displayedColumns: string[] = ['name', 'location', 'status', 'score', 'action'];
  dataSource!: MatTableDataSource<Tower>;


  searchName: string = '';
  searchLat: string = '';
  searchLng: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    try {
      const towers = await this.apiService.getTowers();
      this.dataSource = new MatTableDataSource<Tower>(towers);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });

      // Custom filter predicate
      this.dataSource.filterPredicate = (data: Tower, filter: string) => {
        const filters = JSON.parse(filter);
        const nameMatch = data.name.toLowerCase().includes(filters.name.toLowerCase());

        // Let's implement fuzzy lat/lng match if provided
        let latMatch = true;
        let lngMatch = true;

        if (filters.lat) {
          latMatch = data.location.lat.toString().includes(filters.lat);
        }
        if (filters.lng) {
          lngMatch = data.location.lng.toString().includes(filters.lng);
        }

        return nameMatch && latMatch && lngMatch;
      };
    } catch (error) {
      console.error('Error loading towers list', error);
    }
  }

  applyFilter() {
    if (!this.dataSource) return;
    const filters = {
      name: this.searchName,
      lat: this.searchLat,
      lng: this.searchLng
    };
    this.dataSource.filter = JSON.stringify(filters);
  }
}
