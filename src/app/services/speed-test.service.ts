import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SpeedTestService {
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    async measurePing(): Promise<number> {
        const start = Date.now();
        await firstValueFrom(this.http.get<{ pong: boolean, time: number }>(`${this.apiUrl}/ping`));
        return Date.now() - start;
    }

    async measureDownloadSpeed(): Promise<number> {
        const start = Date.now();
        const res = await firstValueFrom(this.http.get(`${this.apiUrl}/testfile`, { responseType: 'blob', observe: 'response' }));
        const end = Date.now();
        const durationInSeconds = (end - start) / 1000;
        const sizeInBytes = res.body?.size || 5 * 1024 * 1024;
        const sizeInMegabits = (sizeInBytes * 8) / (1024 * 1024);
        return sizeInMegabits / durationInSeconds; // Mbps
    }

    async measureUploadSpeed(): Promise<number> {
        const size = 2 * 1024 * 1024; // 2MB payload
        const payload = new Blob([new Uint8Array(size)], { type: 'application/octet-stream' });
        const start = Date.now();

        await firstValueFrom(this.http.post(`${this.apiUrl}/uploadtest`, payload, { responseType: 'text' }));
        const end = Date.now();
        const durationInSeconds = (end - start) / 1000;
        const sizeInMegabits = (size * 8) / (1024 * 1024);
        return sizeInMegabits / durationInSeconds; // Mbps
    }
}
