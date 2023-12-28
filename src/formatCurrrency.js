const formatCurrency = (acc, mov) => {
  return new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(mov);
};
module.exports = formatCurrency;
