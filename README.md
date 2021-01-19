# great-axios

## Introduction

Lightly packaged based on Axios, HTTP library that can be used for browsers and node. Support jsonp request and Axios configuration and Axios function, it is more convenient to cancel the request.

### Get Started

```bash
npm install great-axios --save
```

## Language

- Typescript

## Example

Here have some examples, hopefully could give you an idea of how to use it:

```typescript
// GreatAxiosInstance
const greatAxios = new GreatAxios({
  reqOptions: {
    ignoreStatus: true, // onyly return serverdatas, default true
    errorKey: "code", // default
    jsonpTimeout: 3000, // jsonp request timeout, default 5000
    catchError: false, // use reject to return an error message, default false
  },
  // AxiosRequestConfig
  reqConfig: {
    headers: { "X-Requested-With": "XMLHttpRequest" },
  },
});
```

```typescript
// interceptor
const interceptor = greatAxios.interceptors4Request((config) => {
  config.withCredentials = false;
});

// do somthing...

// remove request interceptor
greatAxios.removeInterceptor(interceptor);

greatAxios.interceptors4Response((rsp) => {
  // do someting with response
});
```

```typescript
// greatAxios.jsonp(url[,config])
greatAxios
  .jsonp("//xxx/example?param=test", {
    reqOptions: {
      jsonpTimeout: 5000,
    },
  })
  .then((value) => {
    const { code } = value; // code: default errorKey
    if (code && code !== -1) {
      // jspnp request success
    } else {
      // jspnp request failed
    }
  });
```

```typescript
// greatAxios.get(url[,config])
greatAxios
  .get("/example?param=test", {
    // AxiosRequestConfig
    reqConfig: {
      withCredentials: true,
      timeout: 5000,
    },
    reqOptions: {
      catchError: true,
    },
  })
  .then((value) => {
    // get request success
  })
  .catch((error) => {
    // get request failed
  });
```

```typescript
let postCancelID = "";

// greatAxios.post(url[, data[, config]])
greatAxios
  .post(
    "/example",
    {
      params: "test",
    },
    {
      reqOptions: {
        ignoreStatus: false,
      },
      getInnerAttributes: (config) => {
        postCancelID = config.cancelId; // used to cancel this request
        // config.axiosInstance // you can also get an axios instance
      },
    }
  )
  .then((value) => {
    const { status, data } = value;
    if (status === 200) {
      // post request success
    } else {
      // post request failed
    }
  });
```

```typescript
// if you want to cancel a pending request
greatAxios.cancel(postCancelID);
```

## License
[MIT](./LICENSE)

## ChangeLog
1. commit first version --2021/01/10 [HLianfa](https://github.com/Hlianfa)
2. reduce redundancy --2021/01/10 [HLianfa](https://github.com/Hlianfa)
3. add LICENSE --2021/01/10 [HLianfa](https://github.com/Hlianfa)
4. compiled into js --2021/01/19 [HLianfa](https://github.com/Hlianfa)
