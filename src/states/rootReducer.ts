import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth";
import apiReducer from "./api";
import bleReducer from "./ble";
// import cacheReducer from "./cache";
// import modalReducer from "./modal";
// import podReducer from "./pod";
// import snackbarReducer from "./snackbar";

const rootReducer = combineReducers({
  api: apiReducer,
  auth: authReducer,
  ble: bleReducer,
  // cache: cacheReducer,
  // modal: modalReducer,
  // pod: podReducer,
  // snackbar: snackbarReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
