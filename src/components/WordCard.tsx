import { motion } from "framer-motion";
import { MouseEvent } from "react";
import { tUser } from "../utils/types";

type props = {
  id: string;
  word: string;
  showIcon?: boolean;
  voteFN: (id: string) => void;
  flipFN: (id: string) => void;
  votes?: tUser[] | [];
  flipped?: boolean;
  team?: number;
  master?: boolean;
};

const animation = {
  hidden: {
    opacity: 0,
    scale: 0,
    y: -100,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

//put board data (boardID) in a context
const WordsCard = ({
  id,
  word,
  showIcon,
  voteFN,
  votes = [],
  flipped = false,
  team = 0,
  flipFN,
  master = false,
}: props) => {
  const vote = (e: MouseEvent) => {
    if (e.target?.id === "wordCard" && !flipped) {
      voteFN(id);
    }

    if (e.target?.id === "check" && !flipped) {
      flipFN(id);
    }
  };

  return (
    <motion.div
      onClick={vote}
      id="wordCard"
      initial={animation.hidden}
      animate={animation.visible}
      className="bg-gray-100 p-4 text-black font-bold flex-1 rounded flex justify-center items-center cursor-pointer relative"
      style={
        master
          ? {
              borderWidth: 5,
              borderColor:
                team === 1
                  ? "red"
                  : team === 2
                  ? "blue"
                  : team === -1
                  ? "black"
                  : "gray",
              borderStyle: "solid",
              color: team === -1 ? "white" : "black",
              backgroundColor:
                team === 1
                  ? "#ff7a7a"
                  : team === 2
                  ? "#7a81ff"
                  : team === -1
                  ? "#111"
                  : "#d1d5db",
            }
          : {}
      }
    >
      {flipped && (
        <div
          className={`w-full h-full top-0 left-0 absolute rounded z-10 ${
            team === 1 && "bg-red-700"
          } ${team === 2 && "bg-blue-700"} ${team === 0 && "bg-gray-100"} ${
            team === -1 && "bg-black"
          }`}
        ></div>
      )}

      {showIcon && !flipped && !master && (
        <img
          id="check"
          className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-600 fill-white p-[2px] rounded-full"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC6klEQVR4nO3ZX4hWRRjH8WNJSmQh6aIRopQFJZKUpVikbhARRhDRZQQSpWDQRUZdRLCUBHWTiFJQqIGmSEQUiZL9oYssvOimjMKLtLBQQUpiVz8xOODxeM7Zd3fnnPdd3O/lzjM7v9975s/zzGTZBBP0HpiCT3EUK7NeAjOwBFfWxKx2ge1Zr4BrcCwKe7sm7sucgeeyXgE35oQNYl5JzFycy8X0Zb0E9uZMXPIV8HKu/ZOs18ADOYH/YGahfUeu/YmsF8HBnMjnC22L8T3ex+SSvn24A5NaFV0Q8UjOwJMd9rkV7+K/2O/FpsSFLXIf3sH9Vb8UVuDhDoXvwVkXs7spA18VBjqCAcwe5f/7yaV8jfnp1Z8f8FXlHC77GliIXfgRH+CWQvuh2D9srR9jWSPC8+AebMTfOQN/FQ3gdpwpGD0ZzoJczA14FrdlbYOr4oJ9A3eXtG+r+Fq7svEAvq0wMNTYHE8JNqlmS9YrYGmcRssLf19UY+DMaHeuJIQFi4dwoCBqeiHu8xoTG7olfi5+KBEUdqKrC7ErawycwnUVBU8/1mA9nsZddTXGSA28VhASjv/3cFNF/Hc1JgZycfNCBosTFbFHQ24VDI7VwHL8i9N4M9QBw8Q/pp5wuu+P9UEnHMyfJaM1cS2mdhh7BX6Wll8xK2uLQh2cir1tGpgS53BqHm3TxAsNGDjUWvGDaTGZS01/KwYqtuBxtxb64hacmjubEPoUXsKD+QIemxswsDOl+PtwvDDA73glFjA3x5Q6JUOYk2q7/K1moMFYYpbVwmNlXQoD4d6nW3yUwsCyLhr4ItUU+qNLBvaP2UA00d/QgTUcrycxEE3MDhVXQ/lPFfcmM1BIpcON9dZ4W90UnyUXX2JmOtYOU6GNlNN4q9XaIJpZEAfO3+6NhD/jY8lFlwitEzPUgZLb6Sp+wTOdVoOtEd4ROqiDH092M9EE+LBE+DdYlY0HcH18PAnrYnt4auq2pgkue/4HfOiXQf0C200AAAAASUVORK5CYII="
        />
      )}

      {votes?.length > 0 && (
        <div className="absolute top-1 flex gap-1 left-1 w-[80%] text-xs text-white font-normal">
          {votes.map((vote) => (
            <span
              key={vote.id}
              className={`p-[2px] ${
                vote.team === 1 ? "bg-red-500" : "bg-blue-500"
              }`}
              title={vote.name}
            >
              {vote.name.length > 6 ? vote.name.slice(0, 6) + "..." : vote.name}
            </span>
          ))}
        </div>
      )}

      {word}
    </motion.div>
  );
};

export default WordsCard;
