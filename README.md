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

### Install dependencies

  ``` bash

  npm install

  ```

### Settings
  
  The build settings are in src/config/config.json, under 'prod' property.
  You can override these settings using enviroment variables

E.g. *to change prod.WS_URL:*
    ``` bash
      export WS_URL=wss://backend.rsk.co
    ```

### Build for production

  ``` bash
  npm run build
  ```


Serve ./dist folder on web server

### Server configuration

  The client uses [vue-router HTML 5 History mode](https://router.vuejs.org/en/essentials/history-mode.html), this requires a special configuration of the web server:
 
 nginx:

``` javascript

location / {
  try_files $uri $uri/ /index.html;
}
```
