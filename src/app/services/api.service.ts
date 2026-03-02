import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tower } from '../models/tower.model';
import { TestResult } from '../models/test-result.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getTowers(): Observable<Tower[]> {
        return this.http.get<Tower[]>(`${this.apiUrl}/towers`);
    }

    getTowerById(towerId: string): Observable<Tower> {
        return this.http.get<Tower>(`${this.apiUrl}/towers/${towerId}`);
    }

    getTests(towerId?: string): Observable<TestResult[]> {
        const url = towerId ? `${this.apiUrl}/tests?towerId=${towerId}` : `${this.apiUrl}/tests`;
        return this.http.get<TestResult[]>(url);
    }

    getTestById(id: string): Observable<TestResult> {
        return this.http.get<TestResult>(`${this.apiUrl}/tests/${id}`);
    }

    submitTestResult(data: Partial<TestResult>): Observable<{ success: boolean, testResult: TestResult }> {
        return this.http.post<{ success: boolean, testResult: TestResult }>(`${this.apiUrl}/tests`, data);
    }
}
