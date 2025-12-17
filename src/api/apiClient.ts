import type {
    Batch,
    BatchDetail,
    CreateBatchData,
    AddEventData,
    QRCode,
    DashboardStats,
    VerificationResult,
    BatchEvent
} from './types';

const API_URL = 'http://localhost:5000';

// Safe localStorage wrapper to handle blocked storage
function safeGetItem(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn('localStorage access blocked:', error);
        return null;
    }
}

// Get auth token from localStorage
function getAuthToken(): string | null {
    return safeGetItem('agritrace_token');
}

// Generic fetch wrapper with error handling and auth
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const token = getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// ==================== BATCH API ====================

export async function fetchBatches(): Promise<Batch[]> {
    const result = await apiFetch<{ success: boolean; batches: Batch[] }>('/batch');
    return result.batches || [];
}

export async function fetchBatchById(id: string): Promise<BatchDetail | null> {
    try {
        const result = await apiFetch<{ success: boolean; batch: BatchDetail }>(`/batch/${id}`);
        return result.batch || null;
    } catch {
        return null;
    }
}

export async function createBatch(data: CreateBatchData): Promise<{ success: boolean; batch?: { id: string; batchId: string } }> {
    return apiFetch('/batch/create', {
        method: 'POST',
        body: JSON.stringify({
            productName: data.productName,
            productType: data.productType,
            weight: data.weight,
            weightUnit: data.weightUnit,
            farmName: data.farmName,
            location: data.location,
            harvestDate: data.harvestDate,
            description: data.description,
            certifications: data.certifications,
            certificationId: data.certificationId,
        }),
    });
}

export async function splitBatch(
    batchId: string,
    splits: Array<{ weight: number; destination?: string }>
): Promise<{ success: boolean; childBatches?: Array<{ id: string; batchId: string; weight: number }> }> {
    return apiFetch(`/batch/split/${batchId}`, {
        method: 'POST',
        body: JSON.stringify({ splits }),
    });
}

// ==================== EVENT API ====================

export async function fetchBatchEvents(batchId: string): Promise<BatchEvent[]> {
    try {
        const result = await apiFetch<{ success: boolean; events: BatchEvent[] }>(`/event/${batchId}`);
        return result.events || [];
    } catch {
        return [];
    }
}

export async function addEvent(
    batchId: string,
    data: AddEventData
): Promise<{ success: boolean; event?: { id: number; hash: string } }> {
    // Use FormData for file uploads
    const formData = new FormData();
    formData.append('eventType', data.eventType);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('timestamp', data.timestamp);
    formData.append('actor', data.actor);

    if (data.temperature) formData.append('temperature', data.temperature);
    if (data.humidity) formData.append('humidity', data.humidity);
    if (data.notes) formData.append('notes', data.notes);

    if (data.documents) {
        data.documents.forEach(file => formData.append('documents', file));
    }
    if (data.photos) {
        data.photos.forEach(file => formData.append('photos', file));
    }

    const response = await fetch(`${API_URL}/event/add/${batchId}`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to add event');
    }

    return response.json();
}

// ==================== QR CODE API ====================

export async function fetchQRCodes(): Promise<QRCode[]> {
    try {
        const result = await apiFetch<{ success: boolean; qrCodes: QRCode[] }>('/qr/list');
        return result.qrCodes || [];
    } catch {
        return [];
    }
}

export async function generateQRCode(
    batchId: string
): Promise<{ success: boolean; qrDataUrl?: string; verifyUrl?: string }> {
    return apiFetch(`/qr/generate/${batchId}`, {
        method: 'POST',
    });
}

// ==================== VERIFICATION API ====================

export async function verifyBatch(batchIdOrCode: string): Promise<VerificationResult | null> {
    try {
        // Try to find batch by QR code first, then by ID
        const result = await apiFetch<{
            success: boolean;
            batchHashValid?: boolean;
            eventChainValid?: boolean;
            batch?: any;
        }>(`/verify/batch/${batchIdOrCode}`);

        if (!result.batch) return null;

        const batch = result.batch;

        return {
            batchId: batch.batchId,
            isValid: result.batchHashValid || false,
            blockchainVerified: result.eventChainValid || false,
            product: {
                name: batch.product.name,
                type: batch.product.type,
                weight: batch.weight,
                unit: batch.weightUnit,
                description: batch.product.description,
            },
            origin: {
                farm: batch.origin.farm,
                location: batch.origin.location,
                harvestDate: batch.origin.harvestDate || batch.createdAt,
                farmerName: batch.origin.farmerName,
            },
            certifications: batch.certifications?.map((c: any) => c.name) || [],
            certificationId: batch.certificationId || null,
            journey: batch.events,
            blockchain: {
                hash: batch.blockchain.hash,
                network: batch.blockchain.network || 'IPFS (Pinata)',
                timestamp: batch.blockchain.timestamp || batch.createdAt,
                ipfsHash: batch.blockchain.ipfsHash || null,
                ipfsUrl: batch.blockchain.ipfsUrl || null,
            },
            parentBatch: batch.parentBatch || null,
            childBatches: batch.childBatches || [],
            custodyChain: batch.custodyChain || [],
            handoffs: batch.handoffs || [],
        };
    } catch {
        return null;
    }
}

// ==================== DASHBOARD API ====================

interface PieDataItem {
    name: string;
    value: number;
    color: string;
}

interface ChartDataItem {
    name: string;
    batches: number;
    scans: number;
}

interface ActivityItem {
    id: string;
    type: string;
    message: string;
    time: string;
}

export async function fetchDashboardStats(): Promise<{
    stats: DashboardStats;
    recentBatches: Batch[];
    pieData?: PieDataItem[];
    chartData?: ChartDataItem[];
    recentActivity?: ActivityItem[];
}> {
    try {
        const result = await apiFetch<{
            success: boolean;
            stats: DashboardStats;
            recentBatches: Batch[];
            pieData?: PieDataItem[];
            chartData?: ChartDataItem[];
            recentActivity?: ActivityItem[];
        }>('/stats');

        return {
            stats: result.stats || { totalBatches: 0, qrScans: 0, verificationRate: 0 },
            recentBatches: result.recentBatches || [],
            pieData: result.pieData,
            chartData: result.chartData,
            recentActivity: result.recentActivity,
        };
    } catch {
        return {
            stats: { totalBatches: 0, qrScans: 0, verificationRate: 0 },
            recentBatches: [],
        };
    }
}

// ==================== HANDOFF API ====================

export interface Recipient {
    id: number;
    name: string;
    email: string;
    role: string;
    organization: string | null;
}

export async function fetchAvailableRecipients(): Promise<Recipient[]> {
    try {
        const result = await apiFetch<{ success: boolean; recipients: Recipient[] }>('/handoff/available-recipients');
        return result.recipients || [];
    } catch {
        return [];
    }
}

export async function initiateHandoff(
    batchId: string,
    toUserId: number,
    handoffType: string,
    notes?: string
): Promise<{ success: boolean; handoff?: { id: number; hash: string } }> {
    return apiFetch(`/handoff/${batchId}`, {
        method: 'POST',
        body: JSON.stringify({ toUserId, handoffType, notes }),
    });
}
