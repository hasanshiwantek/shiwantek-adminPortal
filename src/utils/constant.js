export const toNumber = (price) => {
    if (!price) return 0;
    return parseFloat(price.replace(/[^0-9.]/g, ""));
};