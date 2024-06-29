export default function transformDateFormat(dateString: string) {
  const date = new Date(dateString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Os meses em JavaScript são baseados em zero
  const year = date.getUTCFullYear();

  return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
}
