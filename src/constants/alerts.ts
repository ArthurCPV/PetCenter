import type { ApiAlertType } from "../types/api";

export const ALERT_TYPES: Array<{
  value: ApiAlertType;
  label: string;
}> = [
  { value: "CONSULTA", label: "Consulta" },
  { value: "REMEDIO", label: "Remédio" },
  { value: "ALIMENTACAO", label: "Alimentação" },
  { value: "EXERCICIO", label: "Exercício" },
  { value: "OUTROS", label: "Outros" },
];

export const getAlertTypeLabel = (type: string): string =>
  ALERT_TYPES.find((alertType) => alertType.value === type)?.label ?? type;
