import {
  createSlice,
  // PayloadAction,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AppState, AppDispatch, ThunkExtraArgument, AppThunk } from ".";

import { State, Device, BleError } from "react-native-ble-plx";

enum ConnectionStatus {
  DISCONNECTED = "DISCONNECTED",
  CONNECTING = "CONNECTING",
  DISCOVERING = "DISCOVERING",
  CONNECTED = "CONNECTED",
  DISCONNECTING = "DISCONNECTING",
}

type BleState = {
  bleState: State;
  // activeError: null,
  // activeSensorTag: null,
  bleDeviceList: Device[];
  connectedDevice?: Device;
  connectionStatus: ConnectionStatus;
};

const initialState: BleState = {
  bleState: State.Unknown,
  bleDeviceList: [],
  connectedDevice: undefined,
  // activeError: null,
  // activeSensorTag: null,
  connectionStatus: ConnectionStatus.DISCONNECTED,
};

// export const initScan = (): AppThunk => async (dispatch, getState, {bleManager}) => {
//   try {
//     const repoDetails = await getRepoDetails(org, repo)
//     dispatch(getRepoDetailsSuccess(repoDetails))
//   } catch (err) {
//     dispatch(getRepoDetailsFailed(err.toString()))
//   }
// }

export const initScan = createAsyncThunk<
  any,
  undefined,
  {
    dispatch: AppDispatch;
    state: AppState;
    extra: ThunkExtraArgument;
    rejectValue: any;
  }
>(
  "ble/initScan",
  // if you type your function argument here
  async (input, { dispatch, extra, rejectWithValue }) => {
    const subscription = extra.bleManager.onStateChange((state) => {
      if (state === State.PoweredOn) {
        dispatch(scan());
        subscription.remove();
      }
    }, true);
  }
);

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
  async (input, { dispatch, extra, rejectWithValue }) => {
    // dispatch(updateConnectionStatus(ConnectionStatus.DISCOVERING));
    extra.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        // return rejectWithValue(error);
      }
      if (device !== null) {
        dispatch(addBleDevice(device));
      }
    });
  }
);

interface ConnectDeviceParams {
  device: Device;
}

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
        dispatch(updateConnectionStatus(ConnectionStatus.DISCOVERING));
        let characteristics = device.discoverAllServicesAndCharacteristics();
        return characteristics;
      })
      .then((device) => {
        // dispatch(changeStatus("Setting Notifications"));
        return device;
      })
      .then(
        (device) => {
          updateConnectionStatus(ConnectionStatus.CONNECTED);
          // dispatch(changeStatus("Listening"));
          dispatch(connectedDevice(device));
          return device;
        },
        (error) => {
          return rejectWithValue(error);
          //return null;
        }
      );
  }
);

// export const login = createAsyncThunk<
//   Api.ApiLoginResponse,
//   Api.ApiLoginParams,
//   {
//     dispatch: AppDispatch;
//     state: AppState;
//     extra: ThunkExtraArgument;
//     rejectValue: MegalithError;
//   }
// >(
//   "api/login",
//   // if you type your function argument here
//   async (input, { extra, rejectWithValue }) => {
//     try {
//       console.log(input);
//       return await extra.apiClient.login(input);
//     } catch (err) {
//       // Sentry.captureException(err);
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

const bleSlice = createSlice({
  name: "ble",
  initialState,
  reducers: {
    reset: () => initialState,
    updateConnectionStatus: (
      state,
      action: PayloadAction<ConnectionStatus>
    ) => {
      return {
        ...state,
        connectionStatus: action.payload,
      };
    },
    addBleDevice: (state, action: PayloadAction<Device>) => {
      const device = action.payload;
      if (
        state.bleDeviceList.some((item) => item.id === device.id) ||
        !device.isConnectable ||
        device.name === null
      ) {
        return state;
      } else {
        return {
          ...state,
          bleDeviceList: [...state.bleDeviceList, device],
        };
      }
    },
    connectedDevice: (state, action: PayloadAction<Device>) => {
      return {
        ...state,
        connectedDevice: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    // builder.addCase(login.pending, (state, action) => {
    //   state.login.status = RequestStatus.FETCHING;
    //   state.login.error = undefined;
    // });
  },
});

export const {
  reset,
  updateConnectionStatus,
  addBleDevice,
  connectedDevice,
} = bleSlice.actions;

export const $ble = (state: AppState) => state.ble;
export const $bleDeviceList = (state: AppState) => state.ble.bleDeviceList;

export default bleSlice.reducer;
