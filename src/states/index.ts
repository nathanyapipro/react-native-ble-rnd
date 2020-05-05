import {
  configureStore,
  Action,
  EnhancedStore,
  getDefaultMiddleware,
  AnyAction,
  Dispatch,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import * as Api from "../api";
import {
  persistStore,
  persistReducer,
  // createMigrate
} from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import createSecureStore from "redux-persist-expo-securestore";
import ENV from "../../env";
import rootReducer, { RootState } from "./rootReducer";
import { BleManager, BleError } from "react-native-ble-plx";
import { bleInit } from "./ble";

let megalithUrl = ENV?.megalithUrl;

export type AppState = RootState;
export type AppDispatch = ThunkDispatch<any, ThunkExtraArgument, AnyAction> &
  Dispatch<AnyAction>;

const bleManager = new BleManager();

export interface ThunkExtraArgument {
  apiClient: Api.ApiClient;
  bleManager: BleManager;
}

export type AppThunk = ThunkAction<
  void,
  RootState,
  ThunkExtraArgument,
  Action<string>
>;

const rootPresistStorageKey = process.env.REACT_APP_STORAGE_KEY || "ble";
const storage = createSecureStore();

export function initStore() {
  const axiosInstance = Api.createAxiosInstance(
    megalithUrl || "http://localhost:5000"
  );
  const apiClient = new Api.ApiClient(axiosInstance);

  // const persistMigrations = {
  //   // April 2020, v2 pod api & datocms
  // };

  const rootPersistConfig = {
    key: rootPresistStorageKey,
    storage,
    whitelist: ["auth"],
    // stateReconciler: autoMergeLevel2,
    // version: 0,
    // migrate: createMigrate(persistMigrations, {
    //   debug: process.env.NODE_ENV !== "production",
    // }),
  };

  const persistedReducer = persistReducer<AppState>(
    rootPersistConfig,
    rootReducer
  );

  const store = configureStore({
    reducer: persistedReducer,
    middleware: [
      // getDefaultMiddleware needs to be called with the state type
      ...getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
        thunk: {
          extraArgument: {
            apiClient,
            bleManager,
          },
        },
      }),
    ] as const, // prevent this from becoming just `Array<Middleware>`
  });

  const persistor = persistStore(store);

  apiClient.setStore(store);

  store.dispatch(bleInit());

  return {
    store,
    persistor,
  };
}
