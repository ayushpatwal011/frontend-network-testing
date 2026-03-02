export interface TestResult {
    _id?: string;
    towerId: string;
    userLocation?: {
        lat: number;
        lng: number;
    };
    results: {
        downloadSpeed: number;
        uploadSpeed: number;
        latency: number;
        signalStrength: number;
        qualityScore: number;
    };
    aiReport: string;
    status: 'good' | 'average' | 'poor';
    testedAt?: string;
}
