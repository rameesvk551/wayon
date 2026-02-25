export type VisaStatus = 'visa-free' | 'evisa' | 'visa-on-arrival' | 'visa-required';

export interface VisaInfo {
    from: string; // country code
    to: string;   // country code
    status: VisaStatus;
    maxStay: string;
    processingTime: string;
    cost: string;
    documents: string[];
    nextSteps: string[];
}

export const visaStatusConfig: Record<VisaStatus, { label: string; color: string; bg: string; emoji: string; border: string }> = {
    'visa-free': { label: 'Visa Free', color: '#059669', bg: '#D1FAE5', emoji: '🟢', border: '#6EE7B7' },
    'evisa': { label: 'eVisa', color: '#D97706', bg: '#FEF3C7', emoji: '🟡', border: '#FCD34D' },
    'visa-on-arrival': { label: 'Visa on Arrival', color: '#EA580C', bg: '#FFF7ED', emoji: '🟠', border: '#FDBA74' },
    'visa-required': { label: 'Visa Required', color: '#DC2626', bg: '#FEE2E2', emoji: '🔴', border: '#FCA5A5' },
};
