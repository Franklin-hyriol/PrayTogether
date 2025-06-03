export function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const delta = 2;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | null = null;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== null) {
      const left = i as number;
      const right = l as number;
      if (left - right === 2) {
        rangeWithDots.push(right + 1);
      } else if (left - right !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i as number;
  }

  return rangeWithDots;
}