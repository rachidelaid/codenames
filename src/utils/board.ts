import randomWords from "random-words";
import { v4 as uuidv4 } from "uuid";

export const getBoard = (blackCard = false, columns = 5, perTeam = 8) => {
  const words = randomWords({ exactly: columns * columns });

  const board = words.map((word) => ({
    word,
    flipped: false,
    id: uuidv4(),
    votes: [],
    team: 0,
  }));

  if (blackCard) {
    const blackCard = Math.floor(Math.random() * board.length);
    board[blackCard].team = -1;
  }

  let team1 = perTeam;
  let team2 = perTeam;
  while (team1 !== 0 && team2 !== 0) {
    for (let i = 0; i < board.length; i++) {
      const element = board[i];
      if (team1 !== 0 && Math.random() > 0.5 && element.team === 0) {
        element.team = 1;
        team1--;
      } else if (team2 !== 0 && Math.random() > 0.5 && element.team === 0) {
        element.team = 2;
        team2--;
      }
    }
  }

  return board;
};
