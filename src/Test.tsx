import { createStaticRouter, useParams } from "./utils/router";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useState } from "react";
import Link from "./utils/link";

export const ROUTER = () =>
  createStaticRouter({
    component: Test,
    path: "/test/:id{/*wtf}",
  });

function Test() {
  const params = useParams<typeof ROUTER>();
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Test</h1>
      <p>Staic Raouterasd</p>
      <p>Path: {"/test/:id{/*wtf}"}</p>
      <p>Params: {JSON.stringify(params)}</p>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR asdasd
        </p>
        <Link to={ROUTER} params={{
          id: "123",
        }}>hello</Link>
      </div>
    </div>
  );
}
