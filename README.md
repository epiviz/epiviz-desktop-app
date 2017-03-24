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

## electron parameters
    port = websocket port number
    workspace = load workspace (not implemented)
    gist = gist id (not implemented)

`electron main.js --port=7123`

To start loading data from local R session - 

1. start epivizrStandalone.
    TODO: update standalone open_browser to open app link. For now manually start server

```
library(epivizrStandalone)
seqinfo <- GenomeInfoDb::Seqinfo(c("chr11","chr2"), c(1000000,8000000))
app <- startStandalone(seqinfo=seqinfo, non_interactive=TRUE, host="localhost", verbose=TRUE)
app$.open_browser()
```

2. start electron `electron main.js --port=7123`

Then adding tracks - 

```
library(epivizr)
data("tcga_colon_blocks")
blocks_chart <- app$plot(tcga_colon_blocks, datasource_name="450k colon_blocks")
```