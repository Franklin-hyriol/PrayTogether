

export interface IBadgeCondition {
    type: 'totalPrayersCreated' | 'totalPrayersMade' | 'totalPrayersReceived' | 'totalHeartsGiven' | 'totalHeartsReceived' | 'isBenefactor';
    value: number | boolean;
}

export interface IBadge {
    _id: string;
    code: string;
    name: string;
    description: string;
    icon: string;
    isSecret?: boolean;
    condition: IBadgeCondition;
    createdAt: string;
    updatedAt: string;
}