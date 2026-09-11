import type { CreatePetData, PetDiary } from "../types";
import type { ApiPet, ApiPetRequest } from "../types/api";
import { request } from "./api";

const parseBirthDate = (value: string | undefined): string | undefined => {
  if (!value || value === "Data de nascimento desconhecida") {
    return undefined;
  }

  const match = value.match(/^(\\d{2})\\/(\\d{2})\\/(\\d{4})$/);

  if (!match) {
    return undefined;
  }

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

const toApiPetRequest = (data: CreatePetData): ApiPetRequest => {
  const requestData: ApiPetRequest = {
    nome: data.name,
    especie: data.species,
  };

  const breed = data.breed?.trim();
  const birthDate = parseBirthDate(data.birthDate);

  if (breed) {
    requestData.raca = breed;
  }

  if (birthDate) {
    requestData.dataNascimento = birthDate;
  }

  return requestData;
};

export const mapApiPetToPetDiary = (pet: ApiPet): PetDiary => ({
  id: String(pet.id),
  name: pet.nome,
  species: pet.especie,
  breed: pet.raca,
  birthDate: pet.dataNascimento,
  entries: [],
});

export const getPets = async (): Promise<PetDiary[]> => {
  const response = await request<unknown>("/api/pets");

  if (Array.isArray(response)) {
    return response.map((pet) => mapApiPetToPetDiary(pet as ApiPet));
  }

  if (
    typeof response === "object" &&
    response !== null &&
    "content" in response &&
    Array.isArray(response.content)
  ) {
    return response.content.map((pet) =>
      mapApiPetToPetDiary(pet as ApiPet),
    );
  }

  return [];
};

export const createPet = async (
  data: CreatePetData,
): Promise<PetDiary> => {
  const response = await request<ApiPet>(
    "/api/pets",
    {
      method: "POST",
      body: toApiPetRequest(data),
    },
  );

  return mapApiPetToPetDiary(response);
};

export const getPet = async (
  petId: string,
): Promise<PetDiary> => {
  const response = await request<ApiPet>(
    `/api/pets/${petId}`,
  );

  return mapApiPetToPetDiary(response);
};

export const updatePet = async (
  petId: string,
  data: CreatePetData,
): Promise<PetDiary> => {
  const response = await request<ApiPet>(
    `/api/pets/${petId}`,
    {
      method: "PUT",
      body: toApiPetRequest(data),
    },
  );

  return mapApiPetToPetDiary(response);
};

export const deletePet = async (
  petId: string,
): Promise<void> => {
  await request<void>(
    `/api/pets/${petId}`,
    {
      method: "DELETE",
    },
  );
};
