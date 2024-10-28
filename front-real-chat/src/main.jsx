import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import store from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster closeButton />
  </>
);
