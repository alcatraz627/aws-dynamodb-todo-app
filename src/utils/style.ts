export const cx = (...params: string[]): string =>
    params.filter((v) => v).join(" ");
