import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SpeedTestService } from '../../services/speed-test.service';
import { Tower } from '../../models/tower.model';
import { TestResult } from '../../models/test-result.model';

type TestState = 'idle' | 'ping' | 'download' | 'upload' | 'submitting' | 'complete';

@Component({
  selector: 'app-speed-tester',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './speed-tester.html',
  styleUrl: './speed-tester.css'
})
export class SpeedTesterComponent implements OnInit {
  towers: Tower[] = [];
  selectedTowerId: string = '';
  searchTower: string = '';

  testingState: TestState = 'idle';
  progress = 0;

  isBSNL: boolean | null = null;
  checkingNetwork = true;

  metrics = {
    latency: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    signalStrength: 0
  };

  resultData: TestResult | null = null;

  private apiService = inject(ApiService);
  private speedTestService = inject(SpeedTestService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit(): Promise<void> {
    // Check if tower ID was passed in route
    const routeTowerId = this.route.snapshot.paramMap.get('id');

    try {
      // Parallel fetch network info and towers
      const [towersData, ipData] = await Promise.all([
        this.apiService.getTowers(),
        this.apiService.getIpInfo()
      ]);

      this.towers = towersData;
      if (routeTowerId) {
        this.selectedTowerId = routeTowerId;
      } else if (this.towers.length > 0) {
        this.selectedTowerId = this.towers[0].towerId; // Default to first available
      }

      // check if user is on BSNL network
      // this.isBSNL = this.apiService.isBSNL(ipData.org);

      this.checkingNetwork = false;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error fetching data', err);
      this.checkingNetwork = false;
      this.cdr.detectChanges();
    }
  }

  get filteredTowers(): Tower[] {
    if (!this.searchTower) return this.towers;
    const s = this.searchTower.toLowerCase();
    return this.towers.filter(t =>
      t.name.toLowerCase().includes(s) ||
      (t.location.city && t.location.city.toLowerCase().includes(s))
    );
  }

  async startTest() {
    if (!this.selectedTowerId && this.towers.length > 0) {
      this.selectedTowerId = this.towers[0].towerId;
    }

    this.testingState = 'ping';
    this.progress = 10;
    this.metrics = { latency: 0, downloadSpeed: 0, uploadSpeed: 0, signalStrength: 85 }; // mock signal
    this.cdr.detectChanges();

    try {
      // 1. Ping
      this.metrics.latency = await this.speedTestService.measurePing();
      this.progress = 30;
      this.cdr.detectChanges();
      await this.delay(500); // Visual pause

      // 2. Download
      this.testingState = 'download';
      this.metrics.downloadSpeed = await this.speedTestService.measureDownloadSpeed();
      this.progress = 60;
      this.cdr.detectChanges();
      await this.delay(500);

      // 3. Upload
      this.testingState = 'upload';
      this.metrics.uploadSpeed = await this.speedTestService.measureUploadSpeed();
      this.progress = 90;
      this.cdr.detectChanges();
      await this.delay(500);

      // 4. Submit
      this.testingState = 'submitting';
      this.cdr.detectChanges();
      this.submitResults();

    } catch (error) {
      console.error('Speed test failed', error);
      alert('Speed test failed. Is the backend running?');
      this.resetTest();
    }
  }

  private async submitResults() {
    const payload = {
      towerId: this.selectedTowerId,
      userLocation: { lat: 20.59, lng: 78.96 }, // Mock user location
      results: { ...this.metrics, qualityScore: 0 } // Score handled by backend
    };

    try {
      const res = await this.apiService.submitTestResult(payload);
      this.resultData = res.testResult;
      this.testingState = 'complete';
      this.progress = 100;
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Failed to submit results', err);
      alert('Failed to save results.');
      this.resetTest();
    }
  }

  resetTest() {
    this.testingState = 'idle';
    this.progress = 0;
    this.resultData = null;
    this.cdr.detectChanges();
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
