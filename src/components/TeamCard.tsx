import { tUser } from "../utils/types";
import Timer from "./Timer";

function TeamCard({
  count,
  players,
  team,
  turn,
  timer,
  endTurn,
}: {
  count: number;
  players: tUser[];
  team: number;
  turn: number;
  timer: number;
  endTurn: () => void;
}) {
  return (
    <div
      className={`bg-${
        team === 1 ? "red" : "blue"
      }-700 p-2 rounded flex flex-col gap-2 divide-y divide-gray-400 text-xs max-h-[150px] overflow-y-auto`}
    >
      <div className="flex justify-between items-center">
        <p className="text-lg">
          Cards Count: <b>{count}</b>
        </p>
        {turn === team && <Timer time={timer} endTurn={endTurn} />}
      </div>

      <div>
        <span
          className="bg-white px-1 rounded"
          style={{
            color: team === 1 ? "red" : "blue",
          }}
        >
          Guessers:
        </span>
        {players
          ?.filter((p: tUser) => !p.master)
          .map((p: tUser) => (
            <p className="text-white">{p.name}</p>
          ))}
      </div>

      <div>
        <span
          className="bg-white px-1 rounded"
          style={{
            color: team === 1 ? "red" : "blue",
          }}
        >
          Hinter:
        </span>
        {players
          ?.filter((p: tUser) => p.master)
          .map((p: tUser) => (
            <p className="text-white">{p.name}</p>
          ))}
      </div>
    </div>
  );
}

export default TeamCard;
