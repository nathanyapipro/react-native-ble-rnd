import * as React from "react";
import { Provider } from "react-redux";
import { initStore } from "./src/states";
import Navigator from "./src/navigators";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { SafeAreaView } from "react-native";

export default function App() {
  const { store } = initStore();
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Provider store={store}>
          <SafeAreaView style={{ flex: 1 }}>
            <Navigator />
          </SafeAreaView>
        </Provider>
      </ApplicationProvider>
    </>
  );
}
