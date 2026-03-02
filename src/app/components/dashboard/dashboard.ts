import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Tower } from '../../models/tower.model';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Circle, Fill, Stroke } from 'ol/style';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  towers: Tower[] = [];
  loading = true;
  map!: Map;
  vectorSource = new VectorSource();

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    console.log("running");

    this.apiService.getTowers().subscribe({
      next: (data) => {
        console.log(data);
        this.towers = data;
        this.loading = false;
        this.addTowerMarkers();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching towers', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
    }
  }

  getGoodTowersCount(): number {
    return this.towers.filter(t => t.status === 'good').length;
  }

  private initMap(): void {
    const vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.map = new Map({
      target: 'ol-map',
      layers: [
        new TileLayer({
          source: new OSM() // Base map
        }),
        vectorLayer       // Markers
      ],
      view: new View({
        center: fromLonLat([78.9629, 20.5937]), // Center of India roughly
        zoom: 5
      })
    });
  }

  private addTowerMarkers(): void {
    if (!this.map) return;

    this.vectorSource.clear();

    this.towers.forEach(tower => {
      if (tower.location && tower.location.lat && tower.location.lng) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([tower.location.lng, tower.location.lat])),
          tower: tower
        });

        const color = this.getStatusColor(tower.status);

        feature.setStyle(new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({ color: color }),
            stroke: new Stroke({ color: '#ffffff', width: 2 })
          })
        }));

        this.vectorSource.addFeature(feature);
      }
    });
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'good': return '#198754';    // Bootstrap Success
      case 'average': return '#ffc107'; // Bootstrap Warning
      case 'poor': return '#dc3545';    // Bootstrap Danger
      default: return '#6c757d';        // Bootstrap Secondary
    }
  }
}
