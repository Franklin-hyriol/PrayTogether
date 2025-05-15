import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


dayjs.extend(relativeTime);


export function formatRelativeTime(date: string): string {
    return dayjs(date).fromNow();
}

export function formatMemberSince(date: string): string {
    return `${dayjs(date).format('MMMM YYYY')}`; // Affiche "Member since March 2024"
}