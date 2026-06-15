export type Word = {
  number: number;
  english: string;
  japanese: string;
};

export type WordBook = {
  id: string;
  title: string;
  words: Word[];
  createdAt: string;
  updatedAt: string;
};

export type WordBookList = WordBook[];

export type TestState = {
  wordBookId: string;
  startNo: number;
  endNo: number;
  selectedWords: Word[]; // シャッフル・抽出された50問の単語
};
