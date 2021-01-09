import { GreatAxiosReqOption } from "./typings";

export const defaultOptions: GreatAxiosReqOption = {
  ignoreStatus: true,
  errorKey: 'code',
  jsonpTimeout: 3000,
  catchError: false,
};
