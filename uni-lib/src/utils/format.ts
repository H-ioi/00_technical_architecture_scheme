import type { UniOption } from "@/types/shared";
import type { UniTableColumn } from "@/types/uni-table";
import type { UniTranslate } from "@/types/i18n";
import { uniLibTranslate } from "@/locales/create-i18n";

export const isEmptyValue = (value: unknown) =>
  value === undefined || value === null || value === "";

export const isBlankValue = (value: unknown) =>
  isEmptyValue(value) ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0);

export const omitBlankValues = (model: Record<string, unknown>) =>
  Object.entries(model).reduce<Record<string, unknown>>(
    (result, [key, value]) => {
      if (isBlankValue(value)) {
        return result;
      }

      result[key] = typeof value === "string" ? value.trim() : value;
      return result;
    },
    {},
  );

export const formatEmpty = (value: unknown, emptyText = "--") =>
  isEmptyValue(value) ? emptyText : String(value);

export const formatDate = (
  value: unknown,
  format = "YYYY-MM-DD HH:mm:ss",
  emptyText = "--",
  inputFormat?: "timestamp" | "iso" | "string",
) => {
  if (isEmptyValue(value)) {
    return emptyText;
  }

  const timestampValue = Number(value);
  const date =
    inputFormat === "timestamp" && !Number.isNaN(timestampValue)
      ? new Date(
          Math.abs(timestampValue) < 1_000_000_000_000
            ? timestampValue * 1000
            : timestampValue,
        )
      : typeof value === "number"
        ? new Date(value)
        : new Date(String(value));

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

export const formatRelativeTime = (
  value: unknown,
  emptyText = "--",
  t: UniTranslate = uniLibTranslate,
) => {
  if (isEmptyValue(value)) {
    return emptyText;
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const absSeconds = Math.abs(diffSeconds);
  const suffix = t(
    diffSeconds >= 0 ? "relativeTime.ago" : "relativeTime.later",
  );

  if (absSeconds < 60) {
    return t("relativeTime.justNow");
  }

  if (absSeconds < 3600) {
    return t("relativeTime.minutes", {
      value: Math.floor(absSeconds / 60),
      suffix,
    });
  }

  if (absSeconds < 86400) {
    return t("relativeTime.hours", {
      value: Math.floor(absSeconds / 3600),
      suffix,
    });
  }

  return t("relativeTime.days", {
    value: Math.floor(absSeconds / 86400),
    suffix,
  });
};

export const formatPercent = (
  value: unknown,
  column?: UniTableColumn,
  emptyText = "--",
) => {
  if (isEmptyValue(value)) {
    return emptyText;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return String(value);
  }

  const scale = column?.percent?.scale ?? 100;
  const suffix = column?.percent?.suffix ?? "%";
  const result = numberValue * scale;

  return typeof column?.percent?.digits === "number"
    ? `${result.toFixed(column.percent.digits)}${suffix}`
    : `${result}${suffix}`;
};

export const formatTableCellText = (
  row: Record<string, unknown>,
  column: UniTableColumn,
  value: unknown,
  index: number,
  valueEnums?: Record<string, UniOption[]>,
  t: UniTranslate = uniLibTranslate,
) => {
  if (column.formatter) {
    return column.formatter(row, column, value, index);
  }

  const columnType = column.type ?? "text";

  if (
    columnType === "date" ||
    columnType === "datetime" ||
    columnType === "time"
  ) {
    return formatDate(
      value,
      column.date?.format ??
        (columnType === "date"
          ? "YYYY-MM-DD"
          : columnType === "time"
            ? "HH:mm:ss"
            : "YYYY-MM-DD HH:mm:ss"),
      column.date?.placeholder,
      column.date?.inputFormat,
    );
  }

  if (columnType === "relativeTime") {
    return formatRelativeTime(value, column.date?.placeholder, t);
  }

  if (columnType === "money") {
    return formatMoney(value);
  }

  if (columnType === "percent") {
    return formatPercent(value, column);
  }

  if (columnType === "boolean") {
    return value ? t("common.yes") : t("common.no");
  }

  if (columnType === "enum" || columnType === "tag") {
    return (
      resolveOption(value, column, valueEnums)?.label ?? formatEmpty(value)
    );
  }

  if (columnType === "array") {
    const key = column.array?.itemLabel;
    return toArray(value)
      .map((item) => {
        if (key && typeof item === "object" && item) {
          return formatEmpty((item as Record<string, unknown>)[key]);
        }

        return formatEmpty(item);
      })
      .join(column.array?.separator ?? "、");
  }

  if (columnType === "json") {
    return value === undefined || value === null ? "--" : JSON.stringify(value);
  }

  return formatEmpty(value);
};
