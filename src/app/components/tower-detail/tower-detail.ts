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

  ngOnInit(): void {
    const towerId = this.route.snapshot.paramMap.get('id');
    if (towerId) {
      this.loadTowerData(towerId);
    } else {
      this.loading = false;
    }
  }

  private loadTowerData(towerId: string): void {
    // 1. Fetch tower details
    this.apiService.getTowerById(towerId).subscribe({
      next: (t) => {
        this.tower = t;
        this.cdr.detectChanges();
        // 2. Fetch history
        this.apiService.getTests(towerId).subscribe({
          next: (testResults) => {
            this.tests = testResults;
            if (this.tests.length > 0) {
              this.latestTest = this.tests[0]; // Backend sorts by testedAt -1
            }
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Failed to load tests', err);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Failed to load tower', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
