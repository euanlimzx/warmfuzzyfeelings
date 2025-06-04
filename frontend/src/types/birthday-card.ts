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
}
