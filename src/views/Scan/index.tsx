import React, { useEffect } from "react";
import {
  Layout,
  Divider,
  TopNavigation,
  List,
  ListItem,
  Icon,
  IconProps,
  TopNavigationAction,
} from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { scan, $ble, connectDevice, ConnectionStatus } from "../../states/ble";
import { Device } from "react-native-ble-plx";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const CloseIcon = (props: IconProps) => (
  <Icon {...props} name="close-circle-outline" />
);

function ScanScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { nearbyDevices, connectionStatus } = useSelector($ble);

  useEffect(() => {
    dispatch(scan());
  }, []);

  useEffect(() => {
    if (connectionStatus === ConnectionStatus.CONNECTED) {
      handleClose();
    }
  }, [connectionStatus]);

  const handleClose = () => {
    navigation.goBack();
  };

  const renderRightActions = () => {
    return (
      <React.Fragment>
        <TopNavigationAction icon={CloseIcon} onPress={handleClose} />
      </React.Fragment>
    );
  };

  const renderItem = ({ item, index }: { item: Device; index: number }) => {
    const handleClick = () => {
      dispatch(connectDevice(item));
    };
    const { name, id } = item;
    return (
      <ListItem onPress={handleClick} title={`${name}`} description={`${id}`} />
    );
  };

  return (
    <>
      <TopNavigation
        style={{ paddingLeft: 16 }}
        title="Nearby Devices"
        alignment="start"
        accessoryRight={renderRightActions}
      />
      <Layout style={styles.container}>
        <List
          data={nearbyDevices}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
      </Layout>
    </>
  );
}

export default ScanScreen;
