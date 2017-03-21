# electron epiviz app

```
download repository
npm install && npm start
```

To build app for distribution - (builds both 32 and 64 bit versions for all platforms - linux, windows, mac os (kernel darwin and mas))

`electron packager . --all  `

to build using electron-builder

has issues since electron-builder can't build apps for macos platform (have to build from a mac os system)
`electron-builder .`
