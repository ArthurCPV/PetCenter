import { request } from "./api";

import type {
  ApiPage,
  ApiRegistroRequest,
  ApiRegistroResponse,
} from "../types/api";

import type { CreateRecordData, Registro } from "../types";

const toRegistro = (registro: ApiRegistroResponse): Registro => ({
  id: String(registro.id),

  entryId: String(registro.idDiarioEntrada),

  type: registro.tipo,

  subtype: registro.subtipo,

  value: registro.valor,

  unit: registro.unidade,

  note: registro.nota,

  createdAt: new Date(registro.horario),

  updatedAt: registro.atualizadoEm
    ? new Date(registro.atualizadoEm)
    : undefined,
});

const toApiRequest = (
  entryId: string,
  data: CreateRecordData,
): ApiRegistroRequest => ({
  entradaId: Number(entryId),

  tipo: data.type,

  subtipo: data.subtype,

  valor: data.value,

  unidade: data.unit,

  nota: data.note,
});

export const listRecords = async (): Promise<ApiRegistroResponse[]> => {
  const response = await request<ApiPage<ApiRegistroResponse>>(
    "/api/registros?size=100",
  );

  return response.content;
};

export const createRecord = async (
  entryId: string,
  data: CreateRecordData,
): Promise<Registro> => {
  const response = await request<ApiRegistroResponse>("/api/registros", {
    method: "POST",
    body: JSON.stringify(toApiRequest(entryId, data)),
  });

  return toRegistro(response);
};

export const updateRecord = async (
  id: string,
  entryId: string,
  data: CreateRecordData,
): Promise<Registro> => {
  const response = await request<ApiRegistroResponse>(`/api/registros/${id}`, {
    method: "PUT",
    body: JSON.stringify(toApiRequest(entryId, data)),
  });

  return toRegistro(response);
};

export const deleteRecord = async (id: string): Promise<void> => {
  await request<void>(`/api/registros/${id}`, {
    method: "DELETE",
  });
};
