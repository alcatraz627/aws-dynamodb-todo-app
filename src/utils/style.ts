export const cx = (...params: (string | boolean | number | undefined | null)[]): string =>
    params.filter((v) => v).join(" ");
