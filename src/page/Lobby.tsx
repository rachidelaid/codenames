import { useParams } from "react-router-dom";
import { tUser } from "../utils/types";
import { useUser } from "../context/User";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useState } from "react";
import { getBoard } from "../utils/board";

const Lobby = ({ players = [] }: { players: tUser[] | undefined }) => {
  const { boardID } = useParams();
  const { user, setUser } = useUser();

  const [loading, setLoading] = useState(false);

  const noTeam = players.filter((player) => player.team === null);
  const redTeam = players.filter((player) => player.team === 1);
  const blueTeam = players.filter((player) => player.team === 2);

  const chooseTeam = (team: number | null) => {
    if (user.team === team && !user.master) return;

    const docRef = doc(db, "rooms", boardID);
    setUser({ ...user, team, master: false });
    const currentPlayer = { ...user, team, master: false };

    setDoc(
      docRef,
      {
        players: [...players.filter((p) => p.id !== user.id), currentPlayer],
      },
      { merge: true }
    );
  };

  const chooseSpyMaster = () => {
    if (user.master) return;

    const team = user.team === 1 ? redTeam : blueTeam;
    const canSpyMaster = team.every((player) => player.master === false);

    if (!canSpyMaster) return;

    setUser({ ...user, master: true });
    const currentPlayer = { ...user, master: true };

    const docRef = doc(db, "rooms", boardID);
    setDoc(
      docRef,
      {
        players: [...players.filter((p) => p.id !== user.id), currentPlayer],
      },
      { merge: true }
    );
  };

  const start = async (e: FormEvent) => {
    e.preventDefault();

    if (noTeam.length) return;
    if (blueTeam.find((player) => player.master === true) === undefined) return;
    if (redTeam.find((player) => player.master === true) === undefined) return;
    if (blueTeam.length < 2) return;
    if (redTeam.length < 2) return;

    setLoading(true);

    //Generate the board
    const { timer, forbidden } = e?.target?.elements;
    const board = getBoard(forbidden.checked);

    const docRef = doc(db, "rooms", boardID);
    await setDoc(
      docRef,
      {
        gameStatus: "playing",
        board,
        timer: +timer.value,
      },
      { merge: true }
    );

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen items-center p-8 gap-8">
      <h1 className="text-2xl font-bold">
        Lobby: <span className="font-light text-base">{boardID}</span>
      </h1>
      <p>players count: {players.length}</p>

      <div className="grid grid-cols-2 gap-2 w-full">
        <div
          className="bg-gray-700/50 p-4 rounded pl-8 flex flex-col gap-2"
          onClick={() => chooseTeam(null)}
        >
          {noTeam.map((player: tUser) => (
            <p key={player.id} className="text-white/75">
              {player.name}
            </p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-red-500/50 p-4 rounded">
            <h3 className="font-bold" onClick={() => chooseTeam(1)}>
              Red Team
            </h3>
            <div className="ml-4 my-2">
              {redTeam
                .filter((p) => !p.master)
                .map((player: tUser) => (
                  <p key={player.id} className="text-white/75">
                    {player.name}
                  </p>
                ))}
            </div>

            {!!redTeam.length && (
              <div className="border p-4 mt-2" onClick={chooseSpyMaster}>
                <p className="font-bold underline">Spy Master</p>
                {redTeam
                  .filter((p) => p.master)
                  .map((player: tUser) => (
                    <p key={player.id} className="text-white/75 ml-2">
                      {player.name}
                    </p>
                  ))}
              </div>
            )}
          </div>
          <div className="bg-blue-500/50 p-4 rounded">
            <h3 className="font-bold" onClick={() => chooseTeam(2)}>
              Blue Team
            </h3>
            <div className="ml-4 my-2">
              {blueTeam
                .filter((p) => !p.master)
                .map((player: tUser) => (
                  <p key={player.id} className="text-white/75">
                    {player.name}
                  </p>
                ))}
            </div>
            {!!blueTeam.length && (
              <div className="border p-4 mt-2" onClick={chooseSpyMaster}>
                <p className="font-bold underline">Spy Master</p>
                {blueTeam
                  .filter((p) => p.master)
                  .map((player: tUser) => (
                    <p key={player.id} className="text-white/75 ml-2">
                      {player.name}
                    </p>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {user.admin && (
        <form className="flex flex-col gap-2 w-full md:w-60" onSubmit={start}>
          <select name="timer" id="timer">
            <option value="60">1 min</option>
            <option value="90">1.5 min</option>
            <option value="120">2 min</option>
          </select>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="forbidden" className="w-fit" />
            <p>the forbidden card</p>
          </div>

          {loading ? (
            <button className="bg-green-800 font-bold rounded px-4 py-2 opacity-50 cursor-not-allowed">
              Starting ...
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-800 font-bold rounded px-4 py-2"
            >
              Start
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default Lobby;
