import * as React from "react";
import { Provider } from "react-redux";
import { initStore } from "./src/states";
import Navigator from "./src/navigators";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { SafeAreaView } from "react-native";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  const { store, persistor } = initStore();
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaView style={{ flex: 1 }}>
              <Navigator />
            </SafeAreaView>
          </PersistGate>
        </Provider>
      </ApplicationProvider>
    </>
  );
}
