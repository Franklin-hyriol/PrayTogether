import { Document, Types } from 'mongoose';


export interface IBadgeCondition {
    type: 'totalPrayersCreated' | 'totalPrayersMade' | 'totalPrayersReceived' | 'totalHeartsGiven' | 'totalHeartsReceived' | 'isBenefactor';
    value: number | boolean;
}

export interface IBadge extends Document {
    _id: Types.ObjectId;
    code: string;
    name: string;
    description: string;
    icon: string;
    isSecret?: boolean;
    condition: IBadgeCondition;
}