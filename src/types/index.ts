export type DiaryEntry = {
  id: string;
  title: string;
  createdAt: Date;
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
