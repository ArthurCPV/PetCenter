export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
};

export type ApiPet = {
  id: number;
  nomeTutor: string;
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  observacoes?: string;
};

export type ApiPetRequest = {
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  observacoes?: string;
};

export type ApiDiaryEntry = {
  id: number;
  idPet: number;
  nomePet: string;
  data: string;
  resumo?: string;
  humorGeral?: string;
  status: string;
  criadoEm: string;
  atualizadoEm?: string;
};

export type ApiDiaryEntryRequest = {
  petId: number;
  data: string;
  resumo?: string;
  humorGeral?: string;
  status: string;
};

export type ApiPage<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};
