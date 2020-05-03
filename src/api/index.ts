import axios, {
  AxiosInstance,
  AxiosError,
  // AxiosRequestConfig
} from "axios";
// import * as retryAxios from "retry-axios";
import {
  User,
  // Pod
} from "../states/types";
//@ts-ignore
import * as Crypto from "expo-crypto";
import { Store } from "../states";
import ENV from "../../env";

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  MOVED_PERMANENTLY = 300,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export type PaginatedRequestParams = {
  page?: number;
  size?: number;
  sort?: string;
  order?: string;
};

export type ApiRegisterParams = {
  email: string;
  password: string;
  givenName: string;
  verificationCode: string;
};

// export type ApiRegisterResponse = User;

// export type ApiGetEmailAvailableParams = {
//   email: string;
// };

// export type ApiGetEmailAvailableResponse = {
//   email: string;
//   emailAvailable: boolean;
// };

// export type ApiSendRegisterVerificationCodeParams = {
//   email: string;
// };

// export type ApiSendRegisterVerificationCodeResponse = any;

export type ApiLoginParams = {
  email: string;
  password: string;
};

export type ApiLoginResponse = User;
export type ApiLogoutResponse = undefined;

// export type ApiGetPodByChipUidParams = {
//   chipUid: string;
// };

// export type ApiGetPodByChipUidResponse = Omit<Pod, "oil" | "id">;

interface AxiosResponseError extends AxiosError {
  response: AxiosError["response"];
}

interface AxiosRequestError extends AxiosError {
  request: AxiosError["request"];
}

const REQUEST_TIMEOUT = 1000000;

export function createAxiosInstance(backendUrl: string): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: backendUrl,
    timeout: REQUEST_TIMEOUT,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  // retryAxios.attach(axiosInstance);

  return axiosInstance;
}

export function instanceOfAxiosResponseError(
  err?: Error
): err is AxiosResponseError {
  return Boolean(
    err && err.hasOwnProperty("config") && err.hasOwnProperty("response")
  );
}

export function instanceOfAxiosRequestError(
  err?: Error
): err is AxiosRequestError {
  return Boolean(
    err && err.hasOwnProperty("config") && err.hasOwnProperty("request")
  );
}

export function instanceOfHttpStatusUnauthorized(err?: Error): boolean {
  return Boolean(
    instanceOfAxiosResponseError(err) &&
      err.response &&
      err.response.status === HttpStatusCode.UNAUTHORIZED
  );
}

export function instanceOfHttpStatusForbidden(err?: Error): boolean {
  return Boolean(
    instanceOfAxiosResponseError(err) &&
      err.response &&
      err.response.status === HttpStatusCode.FORBIDDEN
  );
}

export interface HttpResponse<T> extends Response {
  parsedBody: T;
}

export class ApiClient {
  axiosInstance: AxiosInstance;
  token?: string;
  urlBase: string;
  store?: Store;

  constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
    this.urlBase = ENV?.megalithUrl || "http://localhost:5000";
  }

  setAuthorizationHeader(token: string) {
    this.token = token;
  }

  removeAuthorizationHeader() {
    this.token = undefined;
  }
  setStore(store: Store) {
    this.store = store;
  }

  async getConfig(): Promise<any> {
    const plateformKey = "3bf76fce64167acb7a67dcf696a0ba34";
    if (!this.store) {
      return;
    }
    const { auth } = this.store.getState();

    const { uuid = "" } = auth.profile ? auth.profile : {};
    const { token } = auth;
    const time = Math.floor(+new Date() / 1000) + "";
    const arr = [plateformKey, time, uuid];
    const temp = arr.sort().join("");
    const apiKey = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA1,
      temp
    );

    return {
      headers: {
        Authorization: token,
        "Accept-Language": "en",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "x-airgraft-apiKey": apiKey,
        "x-airgraft-time": time,
        "x-airgraft-uuid": uuid,
        "x-airgraft-version": "cms1",
      },
    };
  }

  // async register(params: ApiRegisterParams) {
  //   const url = `app/user/register`;
  //   const config = this.getConfig();
  //   const response = await this.axiosInstance.post(
  //     url,
  //     JSON.stringify(params),
  //     config
  //   );
  //   const { appToken } = response.data;
  //   if (appToken) {
  //     this.setAuthorizationHeader(appToken);
  //   }
  //   return response.data;
  // }

  // async getEmailAvailable(params: ApiGetEmailAvailableParams) {
  //   const url = `app/user/v2/email-available`;
  //   const config = this.getConfig();
  //   const response = await this.axiosInstance.post(
  //     url,
  //     JSON.stringify(params),
  //     config
  //   );
  //   return response.data;
  // }

  // async sendRegisterVerificationCode(
  //   params: ApiSendRegisterVerificationCodeParams
  // ) {
  //   const url = `app/user/v2/send-register-verification-code`;
  //   const config = this.getConfig();
  //   const response = await this.axiosInstance.post(
  //     url,
  //     JSON.stringify(params),
  //     config
  //   );
  //   return response.data;
  // }

  async login(params: ApiLoginParams): Promise<ApiLoginResponse> {
    const url = `app/user/login`;
    const config = await this.getConfig();
    const response = await this.axiosInstance.post<ApiLoginResponse>(
      url,
      JSON.stringify(params),
      config
    );
    const { appToken } = response.data;
    if (appToken) {
      this.setAuthorizationHeader(appToken);
    }
    return response.data;
  }

  async logout(): Promise<ApiLogoutResponse> {
    const url = `/app/user/logout`;
    const config = await this.getConfig();
    const response = await this.axiosInstance.delete<ApiLogoutResponse>(
      url,
      config
    );
    this.removeAuthorizationHeader();
    return response.data;
  }

  // async getPodByChipUid({
  //   chipUid,
  // }: ApiGetPodByChipUidParams): Promise<ApiGetPodByChipUidResponse> {
  //   const url = `app/pod/v2/podInfoByChipId/${chipUid}`;
  //   const config = this.getConfig();
  //   const response = await this.axiosInstance.get(url, config);
  //   return response.data;
  // }
}
