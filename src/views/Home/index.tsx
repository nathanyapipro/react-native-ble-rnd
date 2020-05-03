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
import { initScan, $bleDeviceList } from "../../states/ble";
import { Device } from "react-native-ble-plx";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
  },
});

function HomeScreen() {
  const dispatch = useDispatch();
  const bleDeviceList = useSelector($bleDeviceList);

  const handleScan = () => {
    dispatch(initScan());
  };
  console.log(bleDeviceList);

  const renderItem = ({ item, index }: { item: Device; index: number }) => {
    const { name, id } = item;
    return <ListItem title={`${name}`} description={`${id}`} />;
  };

  return (
    <>
      <TopNavigation title="Airgraft" alignment="center" />
      <Layout style={{ flex: 1 }}>
        <Button style={styles.button} onPress={handleScan}>
          Scan
        </Button>
        <List
          // style={styles.container}
          data={bleDeviceList}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
      </Layout>
    </>
  );
}

export default HomeScreen;
