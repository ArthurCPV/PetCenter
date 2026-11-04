export const isSameDay = (
  firstDate?: string | Date,
  secondDate?: string | Date,
): boolean => {
  if (!firstDate || !secondDate) {
    return false;
  }

  const first = new Date(firstDate);
  const second = new Date(secondDate);

  return (
    !Number.isNaN(first.getTime()) &&
    !Number.isNaN(second.getTime()) &&
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
};

export const isToday = (date: string | Date): boolean => {
  const dateParts =
    typeof date === "string"
      ? /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(date)
      : null;

  if (dateParts) {
    const [, yearValue, monthValue, dayValue] = dateParts;
    const year = Number(yearValue);
    const month = Number(monthValue);
    const day = Number(dayValue);
    const parsedDate = new Date(year, month - 1, day);
    const today = new Date();

    return (
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month - 1 &&
      parsedDate.getDate() === day &&
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      day === today.getDate()
    );
  }

  return isSameDay(date, new Date());
};

export const getEntryTitle = (entryDate: Date): string => {
  const today = new Date();

  if (isSameDay(entryDate, today)) {
    return "Registro de hoje";
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(entryDate, yesterday)) {
    return "Registro de ontem";
  }

  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(today.getDate() - 2);

  if (isSameDay(entryDate, dayBeforeYesterday)) {
    return "Registro de anteontem";
  }

  return `Registro de ${entryDate.toLocaleDateString("pt-BR")}`;
};

export const formatDateTime = (date: string | Date): string =>
  new Date(date).toLocaleString("pt-BR");
