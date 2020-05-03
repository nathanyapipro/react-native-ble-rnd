import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../views/SignIn";
import MainNavigator from "./MainNavigator";

import { useSelector } from "react-redux";
import { $isAuthenticated } from "../states/auth";

const Stack = createStackNavigator();

function Navigator() {
  const isAuthenticated = useSelector($isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        {/* {isAuthenticated ? ( */}
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
        </>
        {/* ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </>
        )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
