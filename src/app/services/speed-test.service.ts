import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SpeedTestService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    measurePing(): Promise<number> {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            this.http.get<{ pong: boolean, time: number }>(`${this.apiUrl}/ping`).subscribe({
                next: () => resolve(Date.now() - start),
                error: (err) => reject(err)
            });
        });
    }

    measureDownloadSpeed(): Promise<number> {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            // Test file is 5MB
            this.http.get(`${this.apiUrl}/testfile`, { responseType: 'blob', observe: 'response' }).subscribe({
                next: (res) => {
                    const end = Date.now();
                    const durationInSeconds = (end - start) / 1000;
                    const sizeInBytes = res.body?.size || 5 * 1024 * 1024;
                    const sizeInMegabits = (sizeInBytes * 8) / (1024 * 1024);
                    resolve(sizeInMegabits / durationInSeconds); // Mbps
                },
                error: (err) => reject(err)
            });
        });
    }

    measureUploadSpeed(): Promise<number> {
        return new Promise((resolve, reject) => {
            const size = 2 * 1024 * 1024; // 2MB payload
            const payload = new Blob([new Uint8Array(size)], { type: 'application/octet-stream' });
            const start = Date.now();

            this.http.post(`${this.apiUrl}/uploadtest`, payload, { responseType: 'text' }).subscribe({
                next: () => {
                    const end = Date.now();
                    const durationInSeconds = (end - start) / 1000;
                    const sizeInMegabits = (size * 8) / (1024 * 1024);
                    resolve(sizeInMegabits / durationInSeconds); // Mbps
                },
                error: (err) => reject(err)
            });
        });
    }
}
