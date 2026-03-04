import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { IpInfo, Tower } from '../models/tower.model';
import { TestResult } from '../models/test-result.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    async getTowers(): Promise<Tower[]> {
        return firstValueFrom(this.http.get<Tower[]>(`${this.apiUrl}/towers`));
    }

    async getTowerById(towerId: string): Promise<Tower> {
        return firstValueFrom(this.http.get<Tower>(`${this.apiUrl}/towers/${towerId}`));
    }

    async getTests(towerId?: string): Promise<TestResult[]> {
        const url = towerId ? `${this.apiUrl}/tests?towerId=${towerId}` : `${this.apiUrl}/tests`;
        return firstValueFrom(this.http.get<TestResult[]>(url));
    }

    async getTestById(id: string): Promise<TestResult> {
        return firstValueFrom(this.http.get<TestResult>(`${this.apiUrl}/tests/${id}`));
    }

    async submitTestResult(data: Partial<TestResult>): Promise<{ success: boolean, testResult: TestResult }> {
        return firstValueFrom(this.http.post<{ success: boolean, testResult: TestResult }>(`${this.apiUrl}/tests`, data));
    }

    private readonly IP_INFO_URL = 'https://ipinfo.io/json';

    async getIpInfo(): Promise<IpInfo> {
        return firstValueFrom(this.http.get<IpInfo>(this.IP_INFO_URL));
    }

    isBSNL(org: string): boolean {
        return org.includes('BSNL') || org.includes('National Internet Backbone');
    }

}
