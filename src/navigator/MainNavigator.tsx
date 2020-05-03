import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Button, Text, Icon, Footer, FooterTab } from "native-base";
import HomeScreen from "../views/Home";
import OilScreen from "../views/Oil";
import AccountScreen from "../views/Account";

const Tab = createBottomTabNavigator();

function HomeNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => {
        return (
          <Footer>
            <FooterTab>
              <Button
                vertical
                active={props.state.index === 0}
                onPress={() => props.navigation.navigate("Oil")}
              >
                <Icon name="md-water" />
                <Text>Oil</Text>
              </Button>
              <Button
                vertical
                active={props.state.index === 1}
                onPress={() => props.navigation.navigate("Home")}
              >
                <Icon name="md-home" />
                <Text>Home</Text>
              </Button>
              <Button
                vertical
                active={props.state.index === 2}
                onPress={() => props.navigation.navigate("Account")}
              >
                <Icon name="md-person" />
                <Text>Account</Text>
              </Button>
            </FooterTab>
          </Footer>
        );
      }}
    >
      <Tab.Screen name="Oil" component={OilScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default HomeNavigator;
