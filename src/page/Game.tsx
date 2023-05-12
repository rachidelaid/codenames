import { useParams } from "react-router-dom";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, doc, setDoc } from "firebase/firestore";
import { useUser } from "../context/User";
import { db } from "../utils/firebase";
import WordCard from "../components/WordCard";
import TeamCard from "../components/TeamCard";
import { tWord, tUser } from "../utils/types";
import Modal from "../components/Modal";
import HintForm from "../components/HintForm";
import Lobby from "./Lobby";
import { motion } from "framer-motion";

function Game() {
  const { boardID } = useParams();
  const { user } = useUser();
  const [value] = useCollection(collection(db, "rooms"), {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const currentBoard = value?.docs?.find((d) => d.id === boardID)?.data();

  if (!user)
    return (
      <div className="flex flex-col gap-8 max-w-md mx-auto h-screen justify-center items-center">
        <h1 className="text-xl font-bold">Join a Game</h1>

        <Modal boardID={boardID} players={currentBoard?.players} />
      </div>
    );

  if (currentBoard?.gameStatus !== "playing")
    return <Lobby players={currentBoard?.players} />;

  const redCards = currentBoard?.board?.filter(
    (c: tWord) => c.team === 1 && !c.flipped
  ).length;
  const blueCards = currentBoard?.board?.filter(
    (c: tWord) => c.team === 2 && !c.flipped
  ).length;

  const vote = (wordId: string) => {
    if (user.team !== currentBoard?.turn || user.master) return;

    const newBoard = currentBoard?.board?.map((word: tWord) => {
      if (word.id === wordId) {
        if (!word.votes?.find((v: tUser) => v.id === user.id)) {
          word.votes = [...word.votes, user];
        } else {
          word.votes = word.votes.filter((v: tUser) => v.id !== user.id);
        }
      }
      return word;
    });
    const docRef = doc(db, "rooms", boardID);
    setDoc(docRef, { board: newBoard }, { merge: true });
  };

  const flip = (wordId: string) => {
    if (user.team !== currentBoard?.turn || user.master) return;

    const currentWord = currentBoard?.board?.find(
      (w: tWord) => w.id === wordId
    );

    const newBoard = currentBoard?.board?.map((word: tWord) => {
      if (word.id === wordId) {
        word.flipped = true;
      }
      return word;
    });

    const docRef = doc(db, "rooms", boardID);
    setDoc(
      docRef,
      {
        board:
          currentWord.team === -1
            ? newBoard.map((w: tWord) => {
                if (w.team !== user.team) w.flipped = true;
                return w;
              })
            : newBoard,
      },
      { merge: true }
    );

    if (currentWord?.team !== user.team) {
      endTurn();
    }
  };

  const endTurn = () => {
    const docRef = doc(db, "rooms", boardID);
    setDoc(
      docRef,
      {
        turn: currentBoard?.turn === 1 ? 2 : 1,
        hint: {
          word: "",
          count: 0,
        },
        board: currentBoard?.board?.map((w: tWord) => ({ ...w, votes: [] })),
      },
      { merge: true }
    );
  };

  return (
    <div
      className={`flex gap-4 ${currentBoard?.turn === 1 ? "redBG" : "blueBG"}`}
    >
      {redCards === 0 && (
        <div className="h-screen w-full flex justify-center items-center absolute top-0 left-0 z-50 bg-black flex-col gap-8">
          <p className="text-red-500 font-bold text-2xl">RED TEAM WINS</p>
          <p>
            {currentBoard?.players
              .filter((p: tUser) => p.team === 1)
              .map((p: tUser) => p.name)
              .join(", ")}
          </p>
        </div>
      )}

      {blueCards === 0 && (
        <div className="h-screen w-full justify-center items-center text-2xl absolute top-0 left-0 z-50 bg-black flex flex-col gap-8">
          <p className="text-blue-500 font-bold">BLUE TEAM WINS</p>
          <p>
            {currentBoard?.players
              .filter((p: tUser) => p.team === 2)
              .map((p: tUser) => p.name)
              .join(", ")}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 w-[30%] p-4 relative">
        <p>
          players count: <b>{currentBoard?.players.length}</b>
        </p>

        {currentBoard?.turn === user.team && (
          <button className="py-1 px-4 bg-gray-800 rounded" onClick={endTurn}>
            END TURN
          </button>
        )}

        <TeamCard
          count={redCards}
          players={currentBoard?.players.filter((p: tUser) => p.team === 1)}
          team={1}
          turn={currentBoard?.turn}
          timer={currentBoard?.timer}
          endTurn={endTurn}
        />

        <TeamCard
          count={blueCards}
          players={currentBoard?.players.filter((p: tUser) => p.team === 2)}
          team={2}
          turn={currentBoard?.turn}
          timer={currentBoard?.timer}
          endTurn={endTurn}
        />

        {user.master &&
          currentBoard?.turn === user.team &&
          !currentBoard?.hint.word && <HintForm boardID={boardID} />}
      </div>
      <div className="h-screen flex flex-col pt-4 w-full">
        <div className="min-h-[28px] flex items-center justify-center">
          {currentBoard?.hint.word && (
            <motion.p
              initial={{
                opacity: 0,
                y: -100,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              className="bg-white rounded text-black px-4 shadow shadow-white"
            >
              {currentBoard?.hint.word} | <b>{currentBoard?.hint.count}</b>
            </motion.p>
          )}
        </div>
        <div className="col-span-2 grid grid-cols-5 gap-4 p-4 h-full w-full">
          {currentBoard?.board?.map((word: tWord) => (
            <WordCard
              key={word.id}
              id={word.id}
              word={word.word}
              votes={word.votes}
              flipped={word.flipped}
              team={word.team}
              showIcon={currentBoard?.turn === user.team}
              voteFN={vote}
              flipFN={flip}
              master={user?.master}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Game;
