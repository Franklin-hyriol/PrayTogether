import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Étendre dayjs avec le plugin relativeTime
dayjs.extend(relativeTime);

/**
 * Retourne une date relative formatée comme "Il y a X temps".
 * @param date - La date à formater (au format ISO 8601 ou autre format valide pour dayjs).
 * @returns La chaîne de texte de la date relative.
 */
export function formatRelativeTime(date: string): string {
    return dayjs(date).fromNow();
}