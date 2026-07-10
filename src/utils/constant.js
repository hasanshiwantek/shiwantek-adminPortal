export const toNumber = (price) => {
    if (!price) return 0;
    const isNegative = price.toString().trim().startsWith("-");
    const value = parseFloat(price.toString().replace(/[^0-9.]/g, ""));
    return isNegative ? -value : value;
};