export type DiaryEntry = {
  id: string;
  title: string;
  createdAt: Date;
  // legacy/simple fields
  petAte?: string;
  whatAte?: string;
  petSlept?: string;
  observations?: string;
  concerns?: string;
  // new structured fields
  summary?: string;
  mood?: string;
  records?: Array<{
    id: string;
    type: string; // Alimentação | Comportamento | Atividade | Sintoma
    subtype?: string; // for Alimentação: Natural | Ração | Petisco | Outro
    quantity?: string; // numeric string or text
    unit?: string; // g, unidades, etc.
    time?: string; // HH:MM or free text
    note?: string;
  }>;
};

export type PetDiary = {
  id: string;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;

  entries: DiaryEntry[];
};