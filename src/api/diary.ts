import { request } from "./api";
import type { DiaryEntry } from "../types";
import type { ApiDiaryRequest, ApiDiaryResponse, ApiPage } from "../types/api";

const toDiaryEntry = (entry: ApiDiaryResponse): DiaryEntry => ({
  id: String(entry.id),
  title: entry.resumo ?? "",
  createdAt: new Date(entry.criadoEm),
});

const getToday = (): string => {
  return new Date().toISOString().slice(0, 10);
};

export const listDiaryEntries = async (): Promise<ApiDiaryResponse[]> => {
  const response = await request<ApiPage<ApiDiaryResponse>>(
    "/api/diarioentradas?size=100",
  );

  return response.content;
};

export const listDiaryEntriesByPet = async (
  petId: string,
): Promise<DiaryEntry[]> => {
  const entries = await listDiaryEntries();

  return entries
    .filter((entry) => String(entry.idPet) === petId)
    .map(toDiaryEntry);
};

export const createDiaryEntry = async (
  petId: string,
  text: string,
): Promise<DiaryEntry> => {
  const payload: ApiDiaryRequest = {
    petId: Number(petId),
    data: getToday(),
    resumo: text,
    status: "CONCLUIDO",
  };

  const response = await request<ApiDiaryResponse>("/api/diarioentradas", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return toDiaryEntry(response);
};

export const updateDiaryEntry = async (
  id: string,
  petId: string,
  text: string,
): Promise<DiaryEntry> => {
  const payload: ApiDiaryRequest = {
    petId: Number(petId),
    data: getToday(),
    resumo: text,
    status: "CONCLUIDO",
  };

  const response = await request<ApiDiaryResponse>(`/api/diarioentradas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return toDiaryEntry(response);
};

export const deleteDiaryEntry = async (id: string): Promise<void> => {
  await request<void>(`/api/diarioentradas/${id}`, {
    method: "DELETE",
  });
};
