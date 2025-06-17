export interface Source {
  author: string;
  message: string;
}

export interface WordWithSource {
  word: string;
  sources: Source[];
}

export interface BirthdayCardResponse {
  summary: WordWithSource[];
  memories: Memory[];
  characterName: string;
  birthdayDate: string;
}

export interface Wishes {
  name: string;
  message: string;
}

export interface Memory {
  name: string;
  imageUrl: string;
  memory: string;
  wishes: Wishes[];
}
