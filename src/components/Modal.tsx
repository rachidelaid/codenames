import { useState } from "react";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { v4 as uuidv4 } from "uuid";
// import { getBoard } from "../utils/board";
import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";
import { useUser } from "../context/User";
import { tUser } from "../utils/types";

function Modal({
  boardID = "",
  players = [],
}: {
  boardID: string | undefined;
  players: tUser[] | undefined;
}) {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [loading, setLoading] = useState(false);

  const createRoom = async (user: tUser) => {
    // const board = getBoard();

    try {
      const doc = await addDoc(collection(db, "rooms"), {
        players: [user],
        board: [],
        turn: [1, 2][Math.floor(Math.random() * 2)],
        hint: {
          word: "",
          count: 0,
        },
        gameStatus: "lobby",
        timer: null,
        forbidden: false,
      });

      setUser(user);

      navigate(`/${doc.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (user: tUser) => {
    setUser(user);
    const docRef = doc(db, "rooms", boardID);
    setDoc(
      docRef,
      {
        players: [...players, user],
      },
      { merge: true }
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      name,
      // team, master
    } = e?.target?.elements;

    const user = {
      id: uuidv4(),
      name: name.value.trim(),
      master: false,
      team: null,
      admin: false,
    };

    if (boardID) {
      joinRoom(user);
    } else {
      createRoom({
        ...user,
        admin: true,
      });
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
      <input type="text" id="name" placeholder="Your Name ..." />
      {/* <select name="team" id="team">
        <option value="1">Red</option>
        <option value="2">Blue</option>
      </select>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="master" className="w-fit" />
        <p>Become the Hinter</p>
      </div> */}

      {loading ? (
        <button className="bg-gray-800 font-bold rounded px-4 py-2 opacity-50 cursor-not-allowed">
          SUBMITTING ...
        </button>
      ) : (
        <button
          type="submit"
          className="bg-gray-800 font-bold rounded px-4 py-2"
        >
          SUBMIT
        </button>
      )}
    </form>
  );
}

export default Modal;
