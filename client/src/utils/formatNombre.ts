export function formatNombre(n: number): string {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // espace insécable
}