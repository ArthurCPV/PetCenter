import type { ApiAlertType } from "./api";

export type Registro = {
  id: string;
  entryId: string;
  type: string;
  subtype?: string;
  value?: number;
  unit?: string;
  note?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export type DiaryEntry = {
  id: string;
  idPet: string;
  title: string;
  createdAt: Date;
  records: Registro[];
};

export type PetDiary = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  entries: DiaryEntry[];
};

export type CreatePetData = {
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
};

export type CreateRecordData = {
  type: string;
  subtype?: string;
  value?: number;
  unit?: string;
  note?: string;
};

export type Alerta = {
  id: number;
  petId: number;
  petNome: string;
  veterinarioId: number;
  veterinarioNome: string;
  tipo: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  frequenciaHoras?: number;
  dataFim?: string;
  ativo: boolean;
};

export type CreateAlertData = {
  petId: string;
  type: ApiAlertType;
  title: string;
  description?: string;
  startDate: string;
  frequencyHours?: number;
  endDate?: string;
};
