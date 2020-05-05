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
  Spinner,
} from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { scan, $ble, connectDevice, ConnectionStatus } from "../../states/ble";
import { Device, State as BleStatus } from "react-native-ble-plx";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    display: "flex",
    flex: 1,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

const CloseIcon = (props: IconProps) => (
  <Icon {...props} name="close-circle-outline" />
);

function ScanScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const { nearbyDevices, connectionStatus, bleStatus } = useSelector($ble);

  useEffect(() => {
    dispatch(scan());
  }, []);

  useEffect(() => {
    if (
      connectionStatus === ConnectionStatus.CONNECTED ||
      bleStatus === BleStatus.PoweredOff
    ) {
      handleClose();
    }
  }, [connectionStatus, bleStatus]);

  const handleClose = () => {
    navigation.goBack();
  };
  const isLoading = connectionStatus === ConnectionStatus.CONNECTING;

  const renderRightActions = () => {
    return (
      <React.Fragment>
        <TopNavigationAction
          icon={CloseIcon}
          onPress={handleClose}
          disabled={isLoading}
        />
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
          style={styles.list}
          data={nearbyDevices}
          ItemSeparatorComponent={Divider}
          renderItem={renderItem}
        />
        {isLoading && (
          <View style={styles.loading}>
            <Spinner />
          </View>
        )}
      </Layout>
    </>
  );
}

export default ScanScreen;
