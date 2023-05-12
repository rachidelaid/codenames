import { useEffect, useState } from "react";

const clockify = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

const Timer = ({ time, endTurn }: { time: number; endTurn: () => void }) => {
  const [clock, setClock] = useState(time);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (clock > 0) {
        setClock(clock - 1);
      } else {
        endTurn();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [clock]);

  return (
    <div className="border border-green-500 bg-green-950 text-green-500 px-1 rounded text-xs">
      {clockify(clock)}
    </div>
  );
};

export default Timer;
