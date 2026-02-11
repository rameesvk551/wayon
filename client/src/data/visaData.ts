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

// Comprehensive visa data for Indian passport (primary demo)
const indiaVisaData: VisaInfo[] = [
    // Visa Free
    { from: 'IN', to: 'NP', status: 'visa-free', maxStay: 'Unlimited', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport', 'Passport-size photo'], nextSteps: ['Book your flights', 'No visa paperwork needed!'] },
    { from: 'IN', to: 'BT', status: 'visa-free', maxStay: 'Unlimited', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport or Voter ID'], nextSteps: ['Permits required for certain areas', 'Book through registered tour operator'] },
    { from: 'IN', to: 'MU', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket', 'Hotel booking'], nextSteps: ['Book flights', 'Arrange accommodation'] },
    { from: 'IN', to: 'FJ', status: 'visa-free', maxStay: '120 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket'], nextSteps: ['Book your flights', 'Plan island activities'] },
    { from: 'IN', to: 'JO', status: 'visa-free', maxStay: '30 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months'], nextSteps: ['Visit Petra!', 'Book Dead Sea resort'] },
    { from: 'IN', to: 'ID', status: 'visa-free', maxStay: '30 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket'], nextSteps: ['Book flights to Bali', 'Plan your island hopping'] },
    { from: 'IN', to: 'OM', status: 'visa-free', maxStay: '14 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket', 'Hotel confirmation'], nextSteps: ['Explore Muscat', 'Visit Wadi Shab'] },
    { from: 'IN', to: 'BH', status: 'visa-free', maxStay: '14 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket', 'Proof of accommodation'], nextSteps: ['Visit Bahrain Fort', 'Enjoy Manama nightlife'] },
    { from: 'IN', to: 'QA', status: 'visa-free', maxStay: '30 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket'], nextSteps: ['Explore Doha', 'Visit Souq Waqif'] },
    { from: 'IN', to: 'KH', status: 'visa-free', maxStay: '30 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months'], nextSteps: ['Visit Angkor Wat', 'Explore Phnom Penh'] },

    // eVisa
    { from: 'IN', to: 'TH', status: 'evisa', maxStay: '60 days', processingTime: '3-5 business days', cost: '~$35', documents: ['Passport valid 6+ months', 'Passport-size photo', 'Flight itinerary', 'Proof of accommodation', 'Bank statement (3 months)'], nextSteps: ['Apply online at Thai eVisa portal', 'Print your eVisa approval'] },
    { from: 'IN', to: 'VN', status: 'evisa', maxStay: '90 days', processingTime: '3-5 business days', cost: '~$25', documents: ['Passport valid 6+ months', 'Digital photo', 'Travel itinerary'], nextSteps: ['Apply on Vietnam Immigration website', 'Print approval letter'] },
    { from: 'IN', to: 'TR', status: 'evisa', maxStay: '30 days', processingTime: '24-48 hours', cost: '~$50', documents: ['Passport valid 6+ months', 'Return flight ticket', 'Proof of accommodation'], nextSteps: ['Apply at evisa.gov.tr', 'Download and print eVisa'] },
    { from: 'IN', to: 'AU', status: 'evisa', maxStay: '90 days', processingTime: '20-30 days', cost: '~$145', documents: ['Passport valid 6+ months', 'Passport-size photo', 'Bank statements', 'Employment letter', 'Travel itinerary'], nextSteps: ['Apply via immi.homeaffairs.gov.au', 'Gather financial documents'] },
    { from: 'IN', to: 'SG', status: 'evisa', maxStay: '30 days', processingTime: '3-5 business days', cost: '~$20', documents: ['Passport valid 6+ months', 'Digital passport photo', 'Flight itinerary', 'Hotel booking', 'Bank statement'], nextSteps: ['Apply through authorized agent or ICA website', 'Print eVisa for travel'] },
    { from: 'IN', to: 'MY', status: 'evisa', maxStay: '30 days', processingTime: '2-3 business days', cost: '~$25', documents: ['Passport valid 6+ months', 'Digital photo', 'Return ticket', 'Hotel booking'], nextSteps: ['Apply on windowmalaysia.my', 'Print eVisa'] },
    { from: 'IN', to: 'LK', status: 'evisa', maxStay: '30 days', processingTime: '1-3 business days', cost: '~$35', documents: ['Passport valid 6+ months', 'Return ticket', 'Proof of funds'], nextSteps: ['Apply on eta.gov.lk', 'Download ETA'] },
    { from: 'IN', to: 'KE', status: 'evisa', maxStay: '90 days', processingTime: '2-7 business days', cost: '~$50', documents: ['Passport valid 6+ months', 'Passport photo', 'Return ticket', 'Yellow fever certificate'], nextSteps: ['Apply on evisa.go.ke', 'Get yellow fever vaccination'] },
    { from: 'IN', to: 'AE', status: 'evisa', maxStay: '30 days', processingTime: '3-5 business days', cost: '~$80', documents: ['Passport valid 6+ months', 'Passport photo', 'Flight booking', 'Hotel reservation', 'Bank statement'], nextSteps: ['Apply through airline or authorized agent', 'Print eVisa for immigration'] },
    { from: 'IN', to: 'EG', status: 'evisa', maxStay: '30 days', processingTime: '5-7 business days', cost: '~$25', documents: ['Passport valid 6+ months', 'Passport photo', 'Hotel booking', 'Return ticket'], nextSteps: ['Apply on visa2egypt.gov.eg', 'Print eVisa'] },
    { from: 'IN', to: 'SA', status: 'evisa', maxStay: '90 days', processingTime: '1-3 business days', cost: '~$120', documents: ['Passport valid 6+ months', 'Digital photo', 'Return ticket', 'Travel insurance'], nextSteps: ['Apply at visa.visitsaudi.com', 'Download eVisa'] },
    { from: 'IN', to: 'NZ', status: 'evisa', maxStay: '90 days', processingTime: '15-20 days', cost: '~$165', documents: ['Passport valid 6+ months', 'Passport photo', 'Bank statements', 'Employment letter', 'Travel insurance'], nextSteps: ['Apply via immigration.govt.nz', 'Allow sufficient processing time'] },
    { from: 'IN', to: 'MM', status: 'evisa', maxStay: '28 days', processingTime: '3-5 business days', cost: '~$50', documents: ['Passport valid 6+ months', 'Passport photo'], nextSteps: ['Apply on evisa.moip.gov.mm', 'Print approval'] },

    // Visa on Arrival
    { from: 'IN', to: 'MV', status: 'visa-on-arrival', maxStay: '30 days', processingTime: 'On arrival', cost: 'Free', documents: ['Passport valid 6+ months', 'Confirmed hotel booking', 'Return ticket', 'Proof of sufficient funds ($100/day)'], nextSteps: ['Book your resort', 'Prepare required documents'] },
    { from: 'IN', to: 'TZ', status: 'visa-on-arrival', maxStay: '90 days', processingTime: 'On arrival', cost: '~$50', documents: ['Passport valid 6+ months', 'Passport photo', 'Return ticket', 'Yellow fever certificate'], nextSteps: ['Get yellow fever vaccine', 'Carry USD cash for visa fee'] },
    { from: 'IN', to: 'MA', status: 'visa-on-arrival', maxStay: '90 days', processingTime: 'On arrival', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket', 'Hotel booking'], nextSteps: ['Book your riad in Marrakech', 'Plan your medina tour'] },
    { from: 'IN', to: 'ZA', status: 'visa-on-arrival', maxStay: '30 days', processingTime: 'On arrival', cost: 'Free', documents: ['Passport valid 30+ days beyond stay', 'Return ticket', 'Proof of accommodation', 'Proof of sufficient funds'], nextSteps: ['Book your safari', 'Visit Table Mountain'] },
    { from: 'IN', to: 'PH', status: 'visa-on-arrival', maxStay: '30 days', processingTime: 'On arrival', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket', 'Proof of accommodation'], nextSteps: ['Explore Boracay', 'Visit Palawan'] },
    { from: 'IN', to: 'ET', status: 'visa-on-arrival', maxStay: '30 days', processingTime: 'On arrival', cost: '~$52', documents: ['Passport valid 6+ months', 'Passport photo', 'Return ticket'], nextSteps: ['Carry USD for visa fee', 'Visit Addis Ababa'] },
    { from: 'IN', to: 'MX', status: 'visa-on-arrival', maxStay: '180 days', processingTime: 'On arrival', cost: 'Free', documents: ['Valid US/Canada/Japan/UK visa or residence permit', 'Passport valid 6+ months'], nextSteps: ['Ensure you hold a valid third-country visa', 'Plan your Cancún trip'] },

    // Visa Required
    { from: 'IN', to: 'US', status: 'visa-required', maxStay: 'Per visa type', processingTime: '3-5 weeks', cost: '~$185', documents: ['Valid passport', 'DS-160 form', 'Passport photo', 'Interview appointment', 'Bank statements', 'Employment letter', 'Travel itinerary'], nextSteps: ['Complete DS-160 online', 'Schedule visa interview at US Embassy', 'Prepare all financial documents'] },
    { from: 'IN', to: 'GB', status: 'visa-required', maxStay: '6 months', processingTime: '3-6 weeks', cost: '~$130', documents: ['Valid passport', 'Online application', 'Passport photo', 'Bank statements (6 months)', 'Employment letter', 'Travel insurance'], nextSteps: ['Apply on gov.uk', 'Book appointment at VFS center', 'Prepare biometric data'] },
    { from: 'IN', to: 'CA', status: 'visa-required', maxStay: '6 months', processingTime: '4-8 weeks', cost: '~$100', documents: ['Valid passport', 'Application form', 'Passport photos', 'Proof of funds', 'Purpose of visit', 'Travel history'], nextSteps: ['Apply online on IRCC portal', 'Submit biometrics at VAC', 'Track application status'] },
    { from: 'IN', to: 'FR', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen visa form', 'Travel insurance (€30,000)', 'Bank statements', 'Flight booking', 'Hotel reservation', 'Cover letter'], nextSteps: ['Apply at VFS France center', 'Book appointment', 'Get travel insurance'] },
    { from: 'IN', to: 'DE', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen application form', 'Travel insurance', 'Bank statements', 'Cover letter', 'Flight & hotel bookings'], nextSteps: ['Apply at VFS Germany', 'Schedule biometrics appointment'] },
    { from: 'IN', to: 'IT', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Financial proof', 'Accommodation booking'], nextSteps: ['Apply at VFS Italy', 'Prepare Schengen documents'] },
    { from: 'IN', to: 'ES', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen application', 'Travel insurance', 'Bank statements', 'Travel itinerary'], nextSteps: ['Apply at BLS Spain center', 'Get Schengen travel insurance'] },
    { from: 'IN', to: 'CH', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Financial proof', 'Itinerary'], nextSteps: ['Apply at VFS Switzerland', 'Prepare all Schengen docs'] },
    { from: 'IN', to: 'JP', status: 'visa-required', maxStay: '15-90 days', processingTime: '5-7 business days', cost: 'Free', documents: ['Valid passport', 'Visa application form', 'Passport photo', 'Daily schedule', 'Financial documents', 'Employment certificate'], nextSteps: ['Apply at VFS Japan', 'Prepare detailed travel plan'] },
    { from: 'IN', to: 'KR', status: 'visa-required', maxStay: '90 days', processingTime: '5-7 business days', cost: '~$40', documents: ['Valid passport', 'Application form', 'Photo', 'Bank statements', 'Employment letter', 'Itinerary'], nextSteps: ['Apply at VFS Korea', 'Check for K-ETA eligibility'] },
    { from: 'IN', to: 'CN', status: 'visa-required', maxStay: '30 days', processingTime: '4-7 business days', cost: '~$140', documents: ['Valid passport', 'Application form', 'Passport photo', 'Invitation letter', 'Hotel booking', 'Round trip ticket'], nextSteps: ['Apply at Chinese Visa Center', 'Submit documents in person'] },
    { from: 'IN', to: 'BR', status: 'visa-required', maxStay: '90 days', processingTime: '5-10 business days', cost: '~$80', documents: ['Valid passport', 'Application form', 'Passport photo', 'Bank statements', 'Travel itinerary', 'Hotel booking'], nextSteps: ['Apply at VFS Brazil', 'Check eVisa availability'] },
    { from: 'IN', to: 'RU', status: 'visa-required', maxStay: '30 days', processingTime: '4-20 business days', cost: '~$40', documents: ['Valid passport', 'Application form', 'Passport photo', 'Invitation letter or tour voucher', 'Travel insurance'], nextSteps: ['Get invitation letter from Russian agency', 'Apply at VFS Russia'] },
    { from: 'IN', to: 'NL', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Bank statements', 'Itinerary'], nextSteps: ['Apply at VFS Netherlands', 'Prepare Schengen docs'] },
    { from: 'IN', to: 'GR', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Financial proof'], nextSteps: ['Apply at VFS Greece', 'Get Schengen insurance'] },
    { from: 'IN', to: 'PT', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Bank statements'], nextSteps: ['Apply at VFS Portugal', 'Prepare documents'] },
    { from: 'IN', to: 'SE', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Financial proof'], nextSteps: ['Apply at VFS Sweden', 'Book Schengen insurance'] },
    { from: 'IN', to: 'CZ', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Financial documents'], nextSteps: ['Apply at VFS Czech Republic'] },
    { from: 'IN', to: 'AT', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Financial proof'], nextSteps: ['Apply at VFS Austria'] },
    { from: 'IN', to: 'PL', status: 'visa-required', maxStay: '90 days', processingTime: '2-4 weeks', cost: '~$90', documents: ['Valid passport', 'Schengen form', 'Travel insurance', 'Bank statements'], nextSteps: ['Apply at VFS Poland'] },
    { from: 'IN', to: 'AR', status: 'visa-required', maxStay: '90 days', processingTime: '10-15 business days', cost: '~$150', documents: ['Valid passport', 'Application form', 'Photo', 'Bank statements', 'Flight booking'], nextSteps: ['Apply at Argentine consulate', 'Check for AVE authorization'] },
    { from: 'IN', to: 'CO', status: 'visa-required', maxStay: '90 days', processingTime: '5-10 business days', cost: '~$52', documents: ['Valid passport', 'Application form', 'Photo', 'Bank statements'], nextSteps: ['Apply online or at consulate'] },
    { from: 'IN', to: 'IL', status: 'visa-required', maxStay: '90 days', processingTime: '5-10 business days', cost: '~$28', documents: ['Valid passport', 'Application form', 'Photo', 'Travel insurance', 'Itinerary'], nextSteps: ['Apply at Israeli Embassy'] },
    { from: 'IN', to: 'NG', status: 'visa-required', maxStay: '90 days', processingTime: '3-5 business days', cost: '~$80', documents: ['Valid passport', 'Application form', 'Yellow fever certificate', 'Invitation letter'], nextSteps: ['Apply at Nigerian High Commission', 'Get yellow fever vaccine'] },
    { from: 'IN', to: 'BD', status: 'visa-on-arrival', maxStay: '30 days', processingTime: 'On arrival', cost: '~$51', documents: ['Passport valid 6+ months', 'Return ticket', 'Invitation or hotel booking'], nextSteps: ['Carry USD for visa fee', 'Have hotel confirmation ready'] },
    { from: 'IN', to: 'KW', status: 'visa-required', maxStay: '90 days', processingTime: '5-10 business days', cost: '~$25', documents: ['Valid passport', 'Application form', 'Passport photo', 'Sponsor letter'], nextSteps: ['Obtain sponsor in Kuwait', 'Apply through sponsor'] },
    { from: 'IN', to: 'PE', status: 'visa-free', maxStay: '183 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket'], nextSteps: ['Book flights to Lima', 'Plan Machu Picchu trek'] },
    { from: 'IN', to: 'CL', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket'], nextSteps: ['Explore Patagonia', 'Visit Atacama desert'] },
    { from: 'IN', to: 'CR', status: 'visa-free', maxStay: '30 days', processingTime: 'Instant', cost: 'Free', documents: ['Passport valid 6+ months', 'Return ticket', 'Proof of funds'], nextSteps: ['Book eco-lodge', 'Plan rainforest adventures'] },
];

// US passport visa data (secondary demo)
const usVisaData: VisaInfo[] = [
    { from: 'US', to: 'GB', status: 'visa-free', maxStay: '180 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Book your flight', 'No visa needed!'] },
    { from: 'US', to: 'FR', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Book your flight to Paris!'] },
    { from: 'US', to: 'DE', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Explore Berlin and Munich!'] },
    { from: 'US', to: 'IT', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Plan your Roman holiday!'] },
    { from: 'US', to: 'ES', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Barcelona awaits!'] },
    { from: 'US', to: 'JP', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Explore Tokyo and Kyoto!'] },
    { from: 'US', to: 'KR', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport', 'K-ETA'], nextSteps: ['Apply for K-ETA online'] },
    { from: 'US', to: 'SG', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Enjoy Singapore!'] },
    { from: 'US', to: 'TH', status: 'visa-free', maxStay: '30 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Book your Thai adventure!'] },
    { from: 'US', to: 'MX', status: 'visa-free', maxStay: '180 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Explore Mexico!'] },
    { from: 'US', to: 'BR', status: 'evisa', maxStay: '90 days', processingTime: '3-5 business days', cost: '~$80', documents: ['Valid passport', 'Photo', 'Travel itinerary'], nextSteps: ['Apply for eVisa online'] },
    { from: 'US', to: 'AU', status: 'evisa', maxStay: '90 days', processingTime: '1-2 days', cost: '~$20', documents: ['Valid passport'], nextSteps: ['Apply for ETA online'] },
    { from: 'US', to: 'IN', status: 'evisa', maxStay: '60 days', processingTime: '3-5 business days', cost: '~$25', documents: ['Valid passport', 'Photo', 'Travel details'], nextSteps: ['Apply at indianvisaonline.gov.in'] },
    { from: 'US', to: 'TR', status: 'evisa', maxStay: '90 days', processingTime: '24 hours', cost: '~$50', documents: ['Valid passport'], nextSteps: ['Apply at evisa.gov.tr'] },
    { from: 'US', to: 'CN', status: 'visa-required', maxStay: '30 days', processingTime: '4-7 days', cost: '~$140', documents: ['Valid passport', 'Application form', 'Photo', 'Invitation', 'Itinerary'], nextSteps: ['Apply at Chinese Embassy/Consulate'] },
    { from: 'US', to: 'RU', status: 'visa-required', maxStay: '30 days', processingTime: '4-20 days', cost: '~$160', documents: ['Valid passport', 'Application', 'Photo', 'Invitation letter'], nextSteps: ['Obtain invitation letter', 'Apply at Russian consulate'] },
    { from: 'US', to: 'MV', status: 'visa-on-arrival', maxStay: '30 days', processingTime: 'On arrival', cost: 'Free', documents: ['Valid passport', 'Hotel booking', 'Return ticket'], nextSteps: ['Book your overwater villa!'] },
    { from: 'US', to: 'NZ', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport', 'NZeTA'], nextSteps: ['Apply for NZeTA online'] },
    { from: 'US', to: 'AE', status: 'visa-free', maxStay: '30 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Explore Dubai and Abu Dhabi!'] },
    { from: 'US', to: 'CH', status: 'visa-free', maxStay: '90 days', processingTime: 'Instant', cost: 'Free', documents: ['Valid passport'], nextSteps: ['Swiss Alps await!'] },
];

export const allVisaData: VisaInfo[] = [...indiaVisaData, ...usVisaData];

export const getVisaInfo = (from: string, to: string): VisaInfo | undefined =>
    allVisaData.find((v) => v.from === from && v.to === to);

export const getVisaDataByPassport = (passportCode: string): VisaInfo[] =>
    allVisaData.filter((v) => v.from === passportCode);

export const getVisaDataByStatus = (passportCode: string, status: VisaStatus): VisaInfo[] =>
    allVisaData.filter((v) => v.from === passportCode && v.status === status);

export const getVisaStats = (passportCode: string) => {
    const data = getVisaDataByPassport(passportCode);
    return {
        total: data.length,
        visaFree: data.filter((d) => d.status === 'visa-free').length,
        evisa: data.filter((d) => d.status === 'evisa').length,
        visaOnArrival: data.filter((d) => d.status === 'visa-on-arrival').length,
        visaRequired: data.filter((d) => d.status === 'visa-required').length,
    };
};
