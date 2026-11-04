import { request } from "./api";

import type { CreatePetData, PetDiary } from "../types";

import type { ApiPage, ApiPetRequest, ApiPetResponse } from "../types/api";

const UNKNOWN_BIRTH_DATE = "Data de nascimento desconhecida";

const formatBirthDateFromApi = (birthDate: string | undefined): string => {
  if (!birthDate) {
    return UNKNOWN_BIRTH_DATE;
  }

  const isoDateMatch = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!isoDateMatch) {
    return birthDate;
  }

  const [, year, month, day] = isoDateMatch;

  return `${day}/${month}/${year}`;
};

const toPet = (pet: ApiPetResponse): PetDiary => ({
  id: String(pet.id),
  name: pet.nome,
  species: pet.especie,
  breed: pet.raca || "Raça desconhecida",
  birthDate: formatBirthDateFromApi(pet.dataNascimento),
  entries: [],
});

const convertBirthDateToApi = (
  birthDate: string | undefined,
): string | undefined => {
  if (!birthDate) {
    return undefined;
  }

  if (birthDate === UNKNOWN_BIRTH_DATE) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return birthDate;
  }

  const brazilianDateMatch = birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!brazilianDateMatch) {
    return undefined;
  }

  const [, day, month, year] = brazilianDateMatch;

  return `${year}-${month}-${day}`;
};

const toPetRequest = (pet: CreatePetData): ApiPetRequest => ({
  nome: pet.name,
  especie: pet.species,
  raca: pet.breed === "Raça desconhecida" ? undefined : pet.breed,
  dataNascimento: convertBirthDateToApi(pet.birthDate),
});

export const createPet = async (data: CreatePetData): Promise<PetDiary> => {
  const response = await request<ApiPetResponse>("/api/pets", {
    method: "POST",
    body: JSON.stringify(toPetRequest(data)),
  });

  return toPet(response);
};

export const listPets = async (): Promise<PetDiary[]> => {
  const response = await request<ApiPage<ApiPetResponse>>("/api/pets?size=100");

  return response.content.map(toPet);
};

export const listPetsByUser = async (userId: number): Promise<PetDiary[]> => {
  const response = await request<ApiPage<ApiPetResponse>>(
    `/api/pets/user/${userId}?size=100`,
  );

  return response.content.map(toPet);
};

export const updatePet = async (
  id: string,
  data: CreatePetData,
): Promise<PetDiary> => {
  const response = await request<ApiPetResponse>(`/api/pets/${id}`, {
    method: "PUT",
    body: JSON.stringify(toPetRequest(data)),
  });

  return toPet(response);
};

export const deletePet = async (id: string): Promise<void> => {
  await request<void>(`/api/pets/${id}`, {
    method: "DELETE",
  });
};
