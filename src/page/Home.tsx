import Modal from "../components/Modal";

function Home() {
  return (
    <div className="flex flex-col gap-8 max-w-md mx-auto h-screen justify-center items-center">
      <h1 className="text-xl font-bold">Create a Game</h1>

      <Modal />
    </div>
  );
}

export default Home;
