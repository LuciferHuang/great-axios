import { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';

interface GreatAxiosPublicAttributes {
  cancelId: string;
  axiosInstance: AxiosStatic;
}

type GetInnerAttributes = (attributes: GreatAxiosPublicAttributes) => void

export type resolve = (value: unknown) => void
export type reject = (reason?: any) => void
export type BeforeSend = (config: AxiosRequestConfig) => void
export type ResponseHandle = (rsp: AxiosResponse<any>) => void
export type ErrorHandle = (err: any) => void

export interface GreatAxiosReqOption {
  ignoreStatus?: boolean;
  errorKey?: string;
  jsonpTimeout?: number;
  catchError?: boolean;
}

export interface GreatAxiosConfig {
  reqOptions?: GreatAxiosReqOption;
  reqConfig?: AxiosRequestConfig;
  getInnerAttributes?: GetInnerAttributes;
}

export interface GreatAxiosError {
  [x: string]: number | string | AxiosError,
  error: AxiosError;
  msg: string;
}