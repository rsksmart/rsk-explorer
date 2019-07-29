# rsk-explorer client

  Web client for [rsk-explorer-api](https://github.com/rsksmart/rsk-explorer-api)

## Tasks

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```

## Deployment

### Install dependencies

  ``` bash

  npm install

  ```

### Settings

- **WS_URL**: ws backend url
- **STATS_URL**: rsk stats web

E.g. *to change WS_URL:*

``` shell
  export WS_URL=wss://backend.rsk.co
```

### Building for production

``` shell
  npm run build
```

Serve ./dist folder on web server

### HTTP Server configuration

  The client uses [vue-router HTML 5 History mode](https://router.vuejs.org/en/essentials/history-mode.html), this requires a special configuration of the web server:

 nginx:

``` javascript

location / {
  try_files $uri $uri/ /index.html;
}
```
