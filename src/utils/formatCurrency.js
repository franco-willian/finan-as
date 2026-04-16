export const formatCurrency = (value) => {
  let numericValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numericValue)) return 'R$ 0,00';

  const isNegative = numericValue < 0;
  numericValue = Math.abs(numericValue);

  const partes = numericValue.toFixed(2).split('.');
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return `R$ ${isNegative ? '-' : ''}${partes.join(',')}`;
};
