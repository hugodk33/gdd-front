export default function transformDateFormat(dateString: string) {
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    throw new Error('Formato de data inválido. Deve ser "AAAA-MM-DD".');
  }

  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
}
