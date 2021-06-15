# rsk-explorer client

  Web client for [rsk-explorer-api](https://github.com/rsksmart/rsk-explorer-api)

## Tasks

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# serve with tracking
npm run dev-with-tracking

# build for production with minification
npm run build

# build for production with google tracking and hotjar 
# you must set the GA-TAG and HOTJAR_ID first, see 'Settings'
npm run build-with-tracking

```

## Deployment

### Install dependencies

  ``` bash

  npm install

  ```

### Settings

The configuration is provided through this environment variables:

- **WS_URL**: rsk-explorer-api WS url (backend)
- **WS_M_URL**: mining stats-api WS url (backend)
- **STATS_URL**: rsk stats web (link redirect the 'stats' link)
- **GA_TAG**: (optional) Google analytics tag.
- **HOTJAR_ID**: (optional) Hotjar ID.

E.g. *to change the backend url :*

``` shell
  export WS_URL=wss://backend.rsk.co
  export WS_M_URL=<mining-backend-ws-api>
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

#### Double slashed paths

  Double slashed paths fail on router resolution

  E.g. *https://explorer.rsk.co//block/123*
  To avoid this errors use the HTTP Server to rewrite the paths.

 nginx:

``` javascript
  merge_slashes off;
  rewrite ^(.*?)//+(.*?)$ $1/$2 permanent;
```
