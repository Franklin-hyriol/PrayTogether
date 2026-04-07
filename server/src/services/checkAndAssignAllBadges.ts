import IUser from '../interfaces/UserInterface';
import Badge from '../models/Badge';
import UserBadge from '../models/userBadge';

export const checkAndAssignAllBadges = async (user: IUser): Promise<void> => {
    const allBadges = await Badge.find();

    // Récupère les badges déjà obtenus
    const userBadges = await UserBadge.find({ userId: user._id }).select('badgeId');
    const ownedBadgeIds = new Set(userBadges.map(b => b.badgeId.toString()));

    for (const badge of allBadges) {
        if (!badge.condition) continue;
        const { type, value } = badge.condition;

        // Ne pas ré-attribuer un badge déjà obtenu
        if (ownedBadgeIds.has((badge._id).toString())) continue;

        const userValue = (user as any)[type];
        if (userValue === undefined) continue;

        const isEligible =
            typeof value === 'number'
                ? userValue >= value
                : userValue === value;

        if (isEligible) {
            await UserBadge.create({
                userId: user._id,
                badgeId: badge._id
            });
        }
    }
};
