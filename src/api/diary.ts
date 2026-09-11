import type { DiaryEntry } from "../types";
import type {
  ApiDiaryEntry,
  ApiDiaryEntryRequest,
  ApiPage,
} from "../types/api";
import { request } from "./api";

const toFrontendEntry = (entry: ApiDiaryEntry): DiaryEntry => ({
  id: String(entry.id),
  title: entry.resumo ?? "",
  createdAt: new Date(entry.criadoEm),
});

const toApiEntryRequest = (
  petId: string,
  text: string,
  date: Date,
): ApiDiaryEntryRequest => ({
  petId: Number(petId),
  data: date.toISOString().slice(0, 10),
  resumo: text,
  status: "REGISTRADO",
});

export const getDiaryEntries = async (): Promise<DiaryEntry[]> => {
  const response = await request<ApiPage<ApiDiaryEntry>>("/api/diarioentradas");

  return response.content.map(toFrontendEntry);
};

export const createDiaryEntry = async (
  petId: string,
  text: string,
): Promise<DiaryEntry> => {
  const response = await request<ApiDiaryEntry>("/api/diarioentradas", {
    method: "POST",
    body: toApiEntryRequest(petId, text, new Date()),
  });

  return toFrontendEntry(response);
};

export const updateDiaryEntry = async (
  entryId: string,
  petId: string,
  text: string,
  date: Date,
): Promise<DiaryEntry> => {
  const response = await request<ApiDiaryEntry>(
    `/api/diarioentradas/${entryId}`,
    {
      method: "PUT",
      body: toApiEntryRequest(petId, text, date),
    },
  );

  return toFrontendEntry(response);
};

export const getDiaryEntry = async (entryId: string): Promise<DiaryEntry> => {
  const response = await request<ApiDiaryEntry>(
    `/api/diarioentradas/${entryId}`,
  );

  return toFrontendEntry(response);
};

export const deleteDiaryEntry = async (entryId: string): Promise<void> => {
  await request<void>(`/api/diarioentradas/${entryId}`, {
    method: "DELETE",
  });
};

export const getDiaryEntriesByDate = async (
  date: string,
): Promise<DiaryEntry[]> => {
  const response = await request<ApiPage<ApiDiaryEntry>>(
    `/api/diarioentradas/data?data=${encodeURIComponent(date)}`,
  );

  return response.content.map(toFrontendEntry);
};
