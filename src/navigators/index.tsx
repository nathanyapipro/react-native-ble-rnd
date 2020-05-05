import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../views/SignIn";
import CoreNavigator from "./CoreNavigator";
import ScanScreen from "../views/Scan";
import { useSelector } from "react-redux";
import { $isAuthenticated } from "../states/auth";

const RootStack = createStackNavigator();

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
          <RootStack.Screen name="Scan" component={ScanScreen} />
        </>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
