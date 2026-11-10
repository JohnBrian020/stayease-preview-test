export function formatCurrency(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value)) {
    return "KES 0";
  }

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(value);
}

export default formatCurrency;