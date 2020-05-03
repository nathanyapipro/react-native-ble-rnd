import {
  createSlice,
  // PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { AppState, AppDispatch, ThunkExtraArgument } from ".";
import {
  MegalithError,
  RequestStatus,
  // Pod, ActivatedPod
} from "./types";
// import * as Sentry from "@sentry/browser";
import * as Api from "../api";

type ApiCall = {
  status: RequestStatus;
  error?: MegalithError;
  data?: any;
};

const initApiCall: ApiCall = {
  status: RequestStatus.NONE,
  error: undefined,
  data: undefined,
};

type ApiState = {
  login: ApiCall;
  // register: ApiCall;
  // getEmailAvailable: ApiCall;
  // getSendRegisterVerificationCode: ApiCall;
  // getPodByChipUid: ApiCall;
  // postPodActivationPurchased: ApiCall;
};

const initialState: ApiState = {
  login: initApiCall,
  // register: initApiCall,
  // getEmailAvailable: initApiCall,
  // getSendRegisterVerificationCode: initApiCall,
  // getPodByChipUid: initApiCall,
  // postPodActivationPurchased: initApiCall,
};

export const login = createAsyncThunk<
  Api.ApiLoginResponse,
  Api.ApiLoginParams,
  {
    dispatch: AppDispatch;
    state: AppState;
    extra: ThunkExtraArgument;
    rejectValue: MegalithError;
  }
>(
  "api/login",
  // if you type your function argument here
  async (input, { extra, rejectWithValue }) => {
    try {
      console.log(input);
      return await extra.apiClient.login(input);
    } catch (err) {
      // Sentry.captureException(err);
      return rejectWithValue(err.response.data);
    }
  }
);

// export const getEmailAvailable = createAsyncThunk<
//   Api.ApiGetEmailAvailableResponse,
//   Api.ApiGetEmailAvailableParams,
//   {
//     dispatch: AppDispatch;
//     state: AppState;
//     extra: ThunkExtraArgument;
//     rejectValue: MegalithError;
//   }
// >(
//   "api/getEmailAvailable",
//   // if you type your function argument here
//   async (input, { extra, rejectWithValue }) => {
//     try {
//       return await extra.apiClient.getEmailAvailable(input);
//     } catch (err) {
//       Sentry.captureException(err);
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// export const getSendRegisterVerificationCode = createAsyncThunk<
//   Api.ApiSendRegisterVerificationCodeResponse,
//   Api.ApiSendRegisterVerificationCodeParams,
//   {
//     dispatch: AppDispatch;
//     state: AppState;
//     extra: ThunkExtraArgument;
//     rejectValue: MegalithError;
//   }
// >(
//   "api/sendRegisterVerificationCode",
//   // if you type your function argument here
//   async (input, { extra, rejectWithValue }) => {
//     try {
//       return await extra.apiClient.sendRegisterVerificationCode(input);
//     } catch (err) {
//       Sentry.captureException(err);
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// export const register = createAsyncThunk<
//   Api.ApiRegisterResponse,
//   Api.ApiRegisterParams,
//   {
//     dispatch: AppDispatch;
//     state: AppState;
//     extra: ThunkExtraArgument;
//     rejectValue: MegalithError;
//   }
// >(
//   "api/register",
//   // if you type your function argument here
//   async (input, { extra, rejectWithValue }) => {
//     try {
//       return await extra.apiClient.register(input);
//     } catch (err) {
//       Sentry.captureException(err);
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// export const getPodByChipUid = createAsyncThunk<
//   Pod,
//   Api.ApiGetPodByChipUidParams,
//   {
//     dispatch: AppDispatch;
//     state: AppState;
//     extra: ThunkExtraArgument;
//     rejectValue: MegalithError;
//   }
// >(
//   "api/getPodByChipUid",
//   // if you type your function argument here
//   async (input, { extra, rejectWithValue }) => {
//     try {
//       let response = await extra.apiClient.getPodByChipUid(input);
//       let pod = { ...response } as Pod;
//       if (response) {
//         pod.id = pod.chipId;
//       }
//       return pod;
//     } catch (err) {
//       Sentry.captureException(err);
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

// export const postPodActivationPurchased = createAsyncThunk<
//   ActivatedPod,
//   Omit<ActivatedPod, "activationDate">,
//   {
//     dispatch: AppDispatch;
//     state: AppState;
//     extra: ThunkExtraArgument;
//     rejectValue: MegalithError;
//   }
// >(
//   "api/postPodActivationPurchased",
//   // if you type your function argument here
//   async (input, { extra, rejectWithValue }) => {
//     // TODO: Missing Megalith Endpoint
//     try {
//       let response = await {
//         ...input,
//         activationDate: new Date().toString(),
//       };
//       return response;
//     } catch (err) {
//       Sentry.captureException(err);
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    reset: () => initialState,
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.login.status = RequestStatus.FETCHING;
      state.login.error = undefined;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.login.status = RequestStatus.SUCCESS;
      // const { id, uuid, email } = action.payload;
      // Sentry.setUser({
      //   id: `${id}`,
      //   uuid,
      //   email,
      // });
    });
    builder.addCase(login.rejected, (state, action) => {
      state.login.status = RequestStatus.FAILURE;
      state.login.error = action.payload;
    });
    // builder.addCase(register.pending, (state) => {
    //   state.register.status = RequestStatus.FETCHING;
    //   state.register.error = undefined;
    // });
    // builder.addCase(register.fulfilled, (state, action) => {
    //   state.register.status = RequestStatus.SUCCESS;
    //   const { id, uuid, email } = action.payload;
    //   Sentry.setUser({
    //     id: `${id}`,
    //     uuid,
    //     email,
    //   });
    // });
    // builder.addCase(register.rejected, (state, action) => {
    //   state.register.status = RequestStatus.FAILURE;
    //   state.register.error = action.payload;
    // });
    // builder.addCase(getEmailAvailable.pending, (state) => {
    //   state.getEmailAvailable.status = RequestStatus.FETCHING;
    //   state.getEmailAvailable.error = undefined;
    // });
    // builder.addCase(getEmailAvailable.fulfilled, (state, action) => {
    //   state.getEmailAvailable.status = RequestStatus.SUCCESS;
    //   state.getEmailAvailable.data = action.payload;
    // });
    // builder.addCase(getEmailAvailable.rejected, (state, action) => {
    //   state.getEmailAvailable.status = RequestStatus.FAILURE;
    //   state.getEmailAvailable.error = action.payload;
    // });
    // builder.addCase(getSendRegisterVerificationCode.pending, (state) => {
    //   state.getSendRegisterVerificationCode.status = RequestStatus.FETCHING;
    //   state.getSendRegisterVerificationCode.error = undefined;
    // });
    // builder.addCase(
    //   getSendRegisterVerificationCode.fulfilled,
    //   (state, action) => {
    //     state.getSendRegisterVerificationCode.status = RequestStatus.SUCCESS;
    //   }
    // );
    // builder.addCase(
    //   getSendRegisterVerificationCode.rejected,
    //   (state, action) => {
    //     state.getSendRegisterVerificationCode.status = RequestStatus.FAILURE;
    //     state.getSendRegisterVerificationCode.error = action.payload;
    //   }
    // );
    // builder.addCase(getPodByChipUid.pending, (state) => {
    //   state.getPodByChipUid.status = RequestStatus.FETCHING;
    //   state.getPodByChipUid.error = undefined;
    // });
    // builder.addCase(getPodByChipUid.fulfilled, (state, action) => {
    //   state.getPodByChipUid.status = RequestStatus.SUCCESS;
    // });
    // builder.addCase(getPodByChipUid.rejected, (state, action) => {
    //   state.getPodByChipUid.status = RequestStatus.FAILURE;
    //   state.getPodByChipUid.error = action.payload;
    // });
    // builder.addCase(postPodActivationPurchased.pending, (state) => {
    //   state.postPodActivationPurchased.status = RequestStatus.FETCHING;
    //   state.postPodActivationPurchased.error = undefined;
    // });
    // builder.addCase(postPodActivationPurchased.fulfilled, (state, action) => {
    //   state.postPodActivationPurchased.status = RequestStatus.SUCCESS;
    // });
    // builder.addCase(postPodActivationPurchased.rejected, (state, action) => {
    //   state.postPodActivationPurchased.status = RequestStatus.FAILURE;
    //   state.postPodActivationPurchased.error = action.payload;
    // });
  },
});

export const { reset, logout } = apiSlice.actions;

export const $apiLogin = (state: AppState) => state.api.login;
// export const $apiGetEmailAvailable = (state: AppState) =>
//   state.api.getEmailAvailable;
// export const $apiGetSendRegisterVerificationCode = (state: AppState) =>
//   state.api.getSendRegisterVerificationCode;
// export const $apiRegister = (state: AppState) => state.api.register;
// export const $apiGetPodByChipUid = (state: AppState) =>
//   state.api.getPodByChipUid;

export default apiSlice.reducer;
