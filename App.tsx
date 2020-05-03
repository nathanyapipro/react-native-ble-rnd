import * as React from "react";
import { Provider } from "react-redux";
import { initStore } from "./src/states";
import Navigator from "./src/navigator";

export default function App() {
  const { store } = initStore();
  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
