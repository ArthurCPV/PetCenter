import { request } from "./api";
import type { PetDiary } from "../types";
import type {
  ApiPage,
  ApiPetRequest,
  ApiPetResponse,
} from "../types/api";

const UNKNOWN_BIRTH_DATE = "Data de nascimento desconhecida";

const toPet = (pet: ApiPetResponse): PetDiary => ({
  id: String(pet.id),
  name: pet.nome,
  species: pet.especie,
  breed: pet.raca || "Raça desconhecida",
  birthDate: pet.dataNascimento || UNKNOWN_BIRTH_DATE,
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

  // Já está no formato esperado pelo Java LocalDate.
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    return birthDate;
  }

  // Converte DD/MM/YYYY para YYYY-MM-DD.
  const brazilianDateMatch = birthDate.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/,
  );

  if (!brazilianDateMatch) {
    return undefined;
  }

  const [, day, month, year] = brazilianDateMatch;

  return `${year}-${month}-${day}`;
};

const toPetRequest = (
  pet: Parameters<typeof createPet>[0],
): ApiPetRequest => ({
  nome: pet.name,
  especie: pet.species,
  raca:
    pet.breed === "Raça desconhecida"
      ? undefined
      : pet.breed,
  dataNascimento: convertBirthDateToApi(pet.birthDate),
});

export const createPet = async (data: {
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
}): Promise<PetDiary> => {
  const response = await request<ApiPetResponse>("/api/pets", {
    method: "POST",
    body: JSON.stringify(toPetRequest(data)),
  });

  return toPet(response);
};

export const listPets = async (): Promise<PetDiary[]> => {
  const response = await request<ApiPage<ApiPetResponse>>(
    "/api/pets?size=100",
  );

  return response.content.map(toPet);
};

export const getPet = async (id: string): Promise<PetDiary> => {
  const response = await request<ApiPetResponse>(
    `/api/pets/${id}`,
  );

  return toPet(response);
};

export const updatePet = async (
  id: string,
  data: {
    name: string;
    species: string;
    breed?: string;
    birthDate?: string;
  },
): Promise<PetDiary> => {
  const response = await request<ApiPetResponse>(
    `/api/pets/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(toPetRequest(data)),
    },
  );

  return toPet(response);
};

export const deletePet = async (
  id: string,
): Promise<void> => {
  await request<void>(`/api/pets/${id}`, {
    method: "DELETE",
  });
};