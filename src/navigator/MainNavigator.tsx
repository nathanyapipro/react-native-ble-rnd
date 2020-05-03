import * as React from "react";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
// import { Button, Text, Icon, Footer, FooterTab } from "native-base";
import HomeScreen from "../views/Home";
import OilScreen from "../views/Oil";
import AccountScreen from "../views/Account";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconProps,
} from "@ui-kitten/components";

const OilIcon = (props: IconProps) => (
  <Icon {...props} name="droplet-outline" />
);

const HomeIcon = (props: IconProps) => <Icon {...props} name="home-outline" />;

const AccountIcon = (props: IconProps) => (
  <Icon {...props} name="person-outline" />
);

const Tab = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }: BottomTabBarProps) => (
  <BottomNavigation
    indicatorStyle={{ height: 0 }}
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab icon={OilIcon} title="Oil" />
    <BottomNavigationTab icon={HomeIcon} title="Home" />
    <BottomNavigationTab icon={AccountIcon} title="Account" />
  </BottomNavigation>
);

function HomeNavigator() {
  return (
    <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
      <Tab.Screen name="Oil" component={OilScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default HomeNavigator;
