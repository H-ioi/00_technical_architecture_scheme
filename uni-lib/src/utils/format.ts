import type { UniOption, UniTableColumn } from "@/types/shared";

export const isEmptyValue = (value: unknown) =>
  value === undefined || value === null || value === "";

export const formatEmpty = (value: unknown, emptyText = "--") =>
  isEmptyValue(value) ? emptyText : String(value);

export const formatDate = (
  value: unknown,
  format = "YYYY-MM-DD HH:mm:ss",
  emptyText = "--",
) => {
  if (isEmptyValue(value)) {
    return emptyText;
  }

  const date =
    typeof value === "number" ? new Date(value) : new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const pad = (nextValue: number) => String(nextValue).padStart(2, "0");
  const tokens: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
  };

  return Object.entries(tokens).reduce(
    (result, [token, tokenValue]) => result.replace(token, tokenValue),
    format,
  );
};

export const formatMoney = (value: unknown, emptyText = "--") => {
  if (isEmptyValue(value)) {
    return emptyText;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return String(value);
  }

  return numberValue.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const resolveOption = (
  value: unknown,
  column?: UniTableColumn,
  valueEnums?: Record<string, UniOption[]>,
) => {
  const key = String(value);
  const options =
    column?.options ?? (column?.prop ? valueEnums?.[column.prop] : undefined);

  if (options?.length) {
    return options.find(
      (item) => item.value === value || String(item.value) === key,
    );
  }

  const enumValue = column?.valueEnum?.[key];

  if (typeof enumValue === "string") {
    return { label: enumValue, value: key };
  }

  return enumValue;
};

export const toArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (isEmptyValue(value)) {
    return [];
  }

  return [value];
};
