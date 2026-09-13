import { ApiHttpError, request } from "./api";

import type {
  ApiAlertRequest,
  ApiAlertResponse,
  ApiPage,
  ApiAlertType,
} from "../types/api";

export type CreateAlertData = {
  petId: string;
  type: ApiAlertType;
  title: string;
  description?: string;
  startDate: string;
  frequencyHours?: number;
  endDate?: string;
};

export const listAlerts = async (): Promise<ApiAlertResponse[]> => {
  const response = await request<ApiPage<ApiAlertResponse>>(
    "/api/alertas?size=100",
  );

  return response.content;
};

export const createAlert = async (
  data: CreateAlertData,
): Promise<ApiAlertResponse> => {
  const payload: ApiAlertRequest = {
    petId: Number(data.petId),
    tipo: data.type,
    titulo: data.title,
    descricao: data.description,
    dataInicio: data.startDate,
    frequenciaHoras: data.frequencyHours,
    dataFim: data.endDate,
  };

  return request<ApiAlertResponse>("/api/alertas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const activateAlert = async (id: string): Promise<ApiAlertResponse> => {
  throw new ApiHttpError(
    `O backend não disponibiliza uma operação para reativar o alerta ${id}.`,
    501,
  );
};

export const deactivateAlert = async (
  id: string,
): Promise<ApiAlertResponse> => {
  return request<ApiAlertResponse>(`/api/alertas/${id}/desativar`, {
    method: "PATCH",
  });
};
