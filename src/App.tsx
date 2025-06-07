import "./App.css";
import { OuoRouter } from "./utils/OUO";
import {ROUTER} from "./Test";

function App() {

  return (
    <>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <OuoRouter source={[ROUTER]}/>
    </>
  );
}

export default App;
