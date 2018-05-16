# rsk-explorer client

  Client for rsk-explorer-api

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


## Deployment

- 1 Install dependencies

  ``` bash

  npm install
  ```

- 2 Set api server

  Edit src/config/config.json and sets **WS_URL** to rsk-explorer-api url

- 3 Buid for production

  ``` bash
  # build for production 
  npm run build
  ```
- 4 Serve ./dist folder on web server

- 5 Server configuration

  The client uses [vue-router HTML 5 History mode](https://router.vuejs.org/en/essentials/history-mode.html), this requires a special configuration of the web server:
 
 nginx:

``` javascript

location / {
  try_files $uri $uri/ /index.html;
}
```