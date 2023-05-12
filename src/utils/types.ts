export type tUser = {
  id: string;
  name: string;
  master: boolean;
  team: number | null;
  admin: boolean;
};

export type tWord = {
  id: string;
  word: string;
  team: number;
  votes: tUser[];
  flipped: boolean;
};
