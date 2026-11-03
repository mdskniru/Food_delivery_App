export const money = (amount) => `Rs ${Number(amount || 0).toLocaleString('en-IN')}`;

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
