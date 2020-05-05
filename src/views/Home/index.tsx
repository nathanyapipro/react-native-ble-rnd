import * as React from "react";
import {
  Layout,
  Text,
  Divider,
  TopNavigation,
  Button,
  List,
  ListItem,
  ListItemProps,
} from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { $ble, ConnectionStatus } from "../../states/ble";
import { Device } from "react-native-ble-plx";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

function HomeScreen({ navigation }: any) {
  const { connectionStatus } = useSelector($ble);
  const handleScan = () => {
    navigation.navigate("Scan");
  };

  return (
    <>
      <TopNavigation title="Airgraft" alignment="center" />
      <Layout style={styles.layout}>
        {connectionStatus !== ConnectionStatus.CONNECTED && (
          <Button onPress={handleScan}>Scan</Button>
        )}
      </Layout>
    </>
  );
}

export default HomeScreen;
