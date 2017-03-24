/**
 * Created by jayaram kancherla (jkanche at umd dot edu)
 * on 4/22/16.
 */

// var websocket_path = window.location.pathname.split(',');
// websocket_path.pop();

var remote = require('electron').remote;     

console.log(remote.getGlobal('ARGS'));
// epiviz.Config.SETTINGS.websocketport = remote.getGlobal('ARGS').port;

websocket_path = "localhost:" + epiviz.Config.SETTINGS.websocketport;

websocket_host = window.location.host;
epiviz.Config.SETTINGS.dataProviders.push(
    sprintf('epiviz.data.WebsocketDataProvider,%s,%s',
        epiviz.data.WebsocketDataProvider.DEFAULT_ID,
        sprintf("ws://%s:%s", "localhost", remote.getGlobal('ARGS').port)));

epiviz.Config.SETTINGS.configType = "epivizr_standalone";