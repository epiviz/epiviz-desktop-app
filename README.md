# Installation
Please download the latest version of the app from 

https://github.com/epiviz/epiviz-desktop-app/releases


# To build app from source

Install all app requirements. Epiviz app is built using electron (based on nodeJS). Please install nodejs before building.

```
download repository
npm install && npm start
```

To build app for distribution

## Windows
`node_modules/.bin/build --windows`

## MAC
`node_modules/.bin/build --mac dmg`

## Linux
`node_modules/.bin/build --linux deb rpm`

## epiviz app input parameters to launch from command line
    port = websocket port number
    workspace = load workspace (not implemented)
    gist = gist id (not implemented)

If installed as system app - 

`epiviz --port=7123`

If epiviz app was build locally - 

on windows and linux
`/path/to/epiviz/app --port=7123`

on mac
`open -a /path/to/epiviz/app -n --args --port-7123`
