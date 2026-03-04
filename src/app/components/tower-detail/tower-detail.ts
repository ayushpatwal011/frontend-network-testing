import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Tower } from '../../models/tower.model';
import { TestResult } from '../../models/test-result.model';

@Component({
  selector: 'app-tower-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tower-detail.html',
  styleUrl: './tower-detail.css'
})
export class TowerDetailComponent implements OnInit {
  tower: Tower | null = null;
  tests: TestResult[] = [];
  latestTest: TestResult | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    const towerId = this.route.snapshot.paramMap.get('id');
    if (towerId) {
      await this.loadTowerData(towerId);
    } else {
      this.loading = false;
    }
  }

  private async loadTowerData(towerId: string): Promise<void> {
    try {
      // 1. Fetch tower details
      this.tower = await this.apiService.getTowerById(towerId);
      this.cdr.detectChanges();

      // 2. Fetch history
      this.tests = await this.apiService.getTests(towerId);
      if (this.tests.length > 0) {
        this.latestTest = this.tests[0]; // Backend sorts by testedAt -1
      }
      this.loading = false;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to load tower or tests', err);
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
