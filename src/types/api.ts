export type ApiLoginRequest = {
  email: string;
  senha: string;
};

export type ApiLoginResponse = {
  token: string;
};

export type ApiUserRequest = {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  tipoUsuario: "TUTOR" | "VETERINARIO";
};

export type ApiUserResponse = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  tipoUsuario: "TUTOR" | "VETERINARIO";
  ativo: boolean;
  dataCriacao: string;
};

export type ApiPetRequest = {
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  observacoes?: string;
};

export type ApiPetResponse = {
  id: number;
  nomeTutor: string;
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  observacoes?: string;
};

export type ApiDiaryRequest = {
  petId: number;
  data: string;
  resumo?: string;
  humorGeral?: string;
  status: string;
};

export type ApiDiaryResponse = {
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

export type ApiVeterinarianRequest = {
  crmv: string;
  especialidade: string;
  descricao?: string;
};

export type ApiVeterinarianResponse = {
  id: number;
  nomeVeterinario: string;
  crmv: string;
  especialidade: string;
  descricao?: string;
};

export type ApiPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};
