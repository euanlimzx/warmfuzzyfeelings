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
}

export interface Memory {
  name: string;
  imageUrl: string;
  memory: string;
}
