export interface Tower {
    _id?: string;
    towerId: string;
    name: string;
    location: {
        lat: number;
        lng: number;
        city?: string;
    };
    latestStats: {
        downloadSpeed: number;
        uploadSpeed: number;
        latency: number;
        signalStrength: number;
        qualityScore: number;
    };
    status: 'good' | 'average' | 'poor' | 'unknown';
    createdAt?: string;
}
