import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../views/SignIn";
import CoreNavigator from "./CoreNavigator";
import { useSelector } from "react-redux";
import { $isAuthenticated } from "../states/auth";
import { Text, Button, Layout } from "@ui-kitten/components";

const RootStack = createStackNavigator();

function ModalScreen({ navigation }: any) {
  return (
    <Layout style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
      <Button onPress={() => navigation.goBack()}>Dismiss</Button>
    </Layout>
  );
}

function Navigator() {
  const isAuthenticated = useSelector($isAuthenticated);

  return (
    <NavigationContainer>
      <RootStack.Navigator headerMode="none" mode="modal">
        {/* {isAuthenticated ? ( */}
        <>
          <RootStack.Screen name="Core" component={CoreNavigator} />
        </>
        {/* ) : (
          <>
            <RootStack.Screen name="SignIn" component={SignInScreen} />
          </>
        )} */}
        <>
          <RootStack.Screen name="MyModal" component={ModalScreen} />
        </>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
