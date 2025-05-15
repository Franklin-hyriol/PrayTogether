import { Document } from 'mongoose';


export interface IBadgeCondition {
    type: 'totalPrayersCreated' | 'totalPrayersMade' | 'totalPrayersReceived' | 'totalHeartsGiven' | 'totalHeartsReceived' | 'isBenefactor';
    value: number | boolean;
}

export interface IBadge extends Document {
    code: string;
    name: string;
    description: string;
    icon: string;
    isSecret?: boolean;
    condition: IBadgeCondition;
}