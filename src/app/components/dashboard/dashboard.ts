import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { IpInfo, Tower } from '../../models/tower.model';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';

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
  ipInfo: IpInfo | null = null;
  isBSNL: boolean = true;

  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit(): Promise<void> {
    console.log("running");
    try {
      const data = await this.apiService.getTowers();
      console.log(data);
      this.towers = data;
      this.loading = false;
      this.addTowerMarkers();
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error fetching towers', err);
      this.loading = false;
      this.cdr.detectChanges();
    }
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

    const colorMap: Record<string, string> = {
      'good': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%23198754" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>',
      'average': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%23ffc107" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>',
      'poor': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%23dc3545" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>',
      'unknown': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="%236c757d" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>'
    };

    this.towers.forEach(tower => {
      if (tower.location && tower.location.lat && tower.location.lng) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([tower.location.lng, tower.location.lat])),
          tower: tower
        });

        const svgUrl = colorMap[tower.status] || colorMap['unknown'];

        feature.setStyle(new Style({
          image: new Icon({
            src: svgUrl,
            scale: 2.5,
            anchor: [0.5, 1]
          }),
          text: new Text({
            text: tower.towerId,
            offsetY: -35,
            font: '10px "Segoe UI", Arial, sans-serif',
            fill: new Fill({ color: '#000000ff' }),
            stroke: new Stroke({ color: '#ffffffff', width: 2 })
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