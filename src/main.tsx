import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  // 기존에 렌더링된 내용이 있다면 완전히 비우고 새로 시작합니다.
  const root = createRoot(rootElement);
  root.render(<App />);
}