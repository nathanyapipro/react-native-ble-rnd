import {
  createSlice,
  // PayloadAction,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AppState, AppDispatch, ThunkExtraArgument, AppThunk } from ".";

import { State, Device, BleError } from "react-native-ble-plx";

const UUID_DEFAULT_SERVER = "1F9FAC00-65BC-3BBD-3F47-841F6A8BCDD8";

export enum ConnectionStatus {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  DISCOVERING = "DISCOVERING",
  CONNECTED = "CONNECTED",
  DISCONNECTING = "DISCONNECTING",
}

type BleState = {
  bleStatus: State;
  nearbyDevices: Device[];
  connectedDevice?: Device;
  connectionStatus: ConnectionStatus;
};

const initialState: BleState = {
  bleStatus: State.Unknown,
  nearbyDevices: [],
  connectedDevice: undefined,
  connectionStatus: ConnectionStatus.DISCONNECTED,
};

export const bleInit = (): AppThunk => async (dispatch, _, { bleManager }) => {
  bleManager.onStateChange((state) => {
    dispatch(updateStatus(state));
  }, true);

  const connectedDevices = await bleManager.connectedDevices([
    UUID_DEFAULT_SERVER,
  ]);
  console.log(connectedDevices);
  if (connectedDevices && connectedDevices.length > 0) {
    const device = connectedDevices[0];
    dispatch(existingConnectedDevice(device));
  }
};

export const scan = createAsyncThunk<
  any,
  undefined,
  {
    dispatch: AppDispatch;
    state: AppState;
    extra: ThunkExtraArgument;
    rejectValue: BleError;
  }
>(
  "ble/scan",
  // if you type your function argument here
  async (_, { dispatch, extra, rejectWithValue, getState }) => {
    const { ble } = getState();

    if (ble.bleStatus === State.PoweredOn && !ble.connectedDevice) {
      dispatch(updateConnectionStatus(ConnectionStatus.DISCOVERING));
      extra.bleManager.startDeviceScan(
        [
          // UUID_DEFAULT_SERVER
        ],
        null,
        (error, device) => {
          if (error) {
            console.log(error);
            // return rejectWithValue(error);
          }
          if (device !== null) {
            dispatch(addNearbyDevice(device));
          }
        }
      );
    }
  }
);

export const connectDevice = createAsyncThunk<
  Device,
  Device,
  {
    dispatch: AppDispatch;
    state: AppState;
    extra: ThunkExtraArgument;
    rejectValue: any;
  }
>(
  "ble/connectDevice",
  // if you type your function argument here
  async (device, { dispatch, extra, rejectWithValue }) => {
    dispatch(updateConnectionStatus(ConnectionStatus.CONNECTING));
    extra.bleManager.stopDeviceScan();
    return device
      .connect()
      .then((device) => {
        const subscription = device.onDisconnected((error) => {
          dispatch(disconnectDevice());
          subscription.remove();
        });
        let characteristics = device.discoverAllServicesAndCharacteristics();
        return characteristics;
      })
      .then(
        (device) => {
          return device;
        },
        (error) => {
          return rejectWithValue(error);
          //return null;
        }
      );
  }
);

const bleSlice = createSlice({
  name: "ble",
  initialState,
  reducers: {
    reset: () => initialState,
    updateStatus: (state, action: PayloadAction<State>) => {
      return {
        ...state,
        bleStatus: action.payload,
      };
    },
    updateConnectionStatus: (
      state,
      action: PayloadAction<ConnectionStatus>
    ) => {
      return {
        ...state,
        connectionStatus: action.payload,
      };
    },
    addNearbyDevice: (state, action: PayloadAction<Device>) => {
      const device = action.payload;
      if (
        state.nearbyDevices.some((item) => item.id === device.id) ||
        !device.isConnectable ||
        device.name === null
      ) {
        return state;
      } else {
        return {
          ...state,
          nearbyDevices: [...state.nearbyDevices, device],
        };
      }
    },
    existingConnectedDevice: (state, action: PayloadAction<Device>) => {
      return {
        ...state,
        connectedDevice: action.payload,
        connectionStatus: ConnectionStatus.CONNECTED,
        nearbyDevices: [],
      };
    },
    disconnectDevice: (state) => {
      return {
        ...state,
        connectedDevice: undefined,
        connectionStatus: ConnectionStatus.DISCONNECTED,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectDevice.fulfilled, (state, action) => {
      return {
        ...state,
        connectedDevice: action.payload,
        connectionStatus: ConnectionStatus.CONNECTED,
        nearbyDevices: [],
      };
    });
  },
});

export const {
  reset,
  updateStatus,
  updateConnectionStatus,
  existingConnectedDevice,
  addNearbyDevice,
  disconnectDevice,
} = bleSlice.actions;

export const $ble = (state: AppState) => state.ble;
export const $bleDeviceList = (state: AppState) => state.ble.nearbyDevices;

export default bleSlice.reducer;
