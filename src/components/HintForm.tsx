import { setDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebase";

function HintForm({ boardID }: { boardID: string | undefined }) {
  const sendHint = async (e: FormEvent) => {
    e.preventDefault();
    const { hint, count } = e.target.elements;

    const docRef = doc(db, "rooms", boardID);
    setDoc(
      docRef,
      {
        hint: {
          word: hint.value,
          count: +count.value,
        },
      },
      { merge: true }
    );
  };

  return (
    <form className="flex flex-col gap-1 mt-auto" onSubmit={sendHint}>
      <input type="text" id="hint" placeholder="One Word Hint" />
      <input type="number" id="count" defaultValue={1} min={1} max={10} />
      <button
        type="submit"
        className="py-1 px-4 bg-green-700 font-bold rounded"
      >
        Place Hint
      </button>
    </form>
  );
}

export default HintForm;
