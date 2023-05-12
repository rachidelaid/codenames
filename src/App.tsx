import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from "./page/Home";
import Game from "./page/Game";
import { UserProvider } from "./context/User";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/:boardID",
    element: <Game />,
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
