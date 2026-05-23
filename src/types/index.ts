export type DiaryEntry = {
  id: string;
  title: string;
  createdAt: Date;
  petAte?: string;
  whatAte?: string;
  petSlept?: string;
  observations?: string;
  concerns?: string;
};

export type PetDiary = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;

  entries: DiaryEntry[];
};