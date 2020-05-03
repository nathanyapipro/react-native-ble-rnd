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
// import * as Apollo from "../services/apollo";
// import {
//   persistStore,
//   persistReducer,
//   // createMigrate
// } from "redux-persist";
// import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
// import localForage from "localforage";
import ENV from "../../env";
import rootReducer, { RootState } from "./rootReducer";
// import ApolloClient from "apollo-client";
// import { NormalizedCacheObject } from "apollo-cache-inmemory";
import { BleManager, BleError } from "react-native-ble-plx";

let megalithUrl = ENV?.megalithUrl;

export type AppState = RootState;
export type AppDispatch = ThunkDispatch<any, ThunkExtraArgument, AnyAction> &
  Dispatch<AnyAction>;

const bleManager = new BleManager();

export interface ThunkExtraArgument {
  apiClient: Api.ApiClient;
  bleManager: BleManager;
  // apolloClient: ApolloClient<NormalizedCacheObject>;
}

export type AppThunk = ThunkAction<
  void,
  RootState,
  ThunkExtraArgument,
  Action<string>
>;

export type Store = EnhancedStore<AppState, any, any>;

// const rootPresistStorageKey = process.env.REACT_APP_STORAGE_KEY || "demo";

export function initStore() {
  const axiosInstance = Api.createAxiosInstance(
    megalithUrl || "http://localhost:5000"
  );
  const apiClient = new Api.ApiClient(axiosInstance);

  // const persistMigrations = {
  //   // April 2020, v2 pod api & datocms
  // };

  // const rootPersistConfig = {
  //   key: rootPresistStorageKey,
  //   storage: localForage,
  //   whitelist: ["auth", "cache", "pod"],
  //   stateReconciler: autoMergeLevel2,
  //   // version: 0,
  //   // migrate: createMigrate(persistMigrations, {
  //   //   debug: process.env.NODE_ENV !== "production",
  //   // }),
  // };

  // const persistedReducer = persistReducer<AppState>(
  //   rootPersistConfig,
  //   rootReducer
  // );

  const store = configureStore({
    reducer: rootReducer, //persistedReducer,
    middleware: [
      // getDefaultMiddleware needs to be called with the state type
      ...getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
        thunk: {
          extraArgument: {
            apiClient,
            bleManager,
            // apolloClient: Apollo.client,
          },
        },
      }),
    ] as const, // prevent this from becoming just `Array<Middleware>`
  });

  // const persistor = persistStore(store);

  apiClient.setStore(store);

  return {
    store,
    // persistor,
    // client: Apollo.client,
  };
}
