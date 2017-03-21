/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 2/18/14
 * Time: 10:17 PM
 */

goog.provide('epiviz.ui.WebArgsManager');

/**
 * @param {epiviz.ui.LocationManager} locationManager
 * @param {epiviz.workspaces.WorkspaceManager} workspaceManager
 * @constructor
 */
epiviz.ui.WebArgsManager = function(locationManager, workspaceManager) {
  /**
   * @type {epiviz.ui.LocationManager}
   * @private
   */
  this._locationManager = locationManager;

  /**
   * @type {epiviz.workspaces.WorkspaceManager}
   * @private
   */
  this._workspaceManager = workspaceManager;

  this._registerLocationChanged();
  this._registerActiveWorkspaceChanged();
};

/**
 * @type {Object.<string, *>}
 */
epiviz.ui.WebArgsManager.WEB_ARGS = epiviz.ui.WebArgsManager.WEB_ARGS || {};

/**
 * @returns {Object.<string, string|Array.<string>>}
 */
epiviz.ui.WebArgsManager.extractWindowLocationArgs = function() {
  var argsStr = window.location.search.length > 0 ? window.location.search.substr(1) : '';
  var argPairs = argsStr.split('&');

  var args = {};
  argPairs.forEach(function(pair, i) {
    if (pair.trim().length == 0) { return; }
    var arrInd = pair.indexOf('[]');
    if (arrInd == 0) { return; }

    var arg, val;
    var eqInd = pair.indexOf('=');
    if (eqInd < 0) {
      arg = (arrInd < 0) ? pair : pair.substr(0, arrInd);
      val = 'true';
    } else {
      arg = (arrInd < 0) ? pair.substr(0, eqInd) : pair.substr(0, arrInd);
      val = pair.substr(eqInd + 1);
    }

    arg = decodeURIComponent(arg);
    val = decodeURIComponent(val);

    if (arrInd < 0) { args[arg] = val; }
    else {
      if (!(arg in args)) { args[arg] = []; }
      args[arg].push(val);
    }
  });

  return args;
};

/**
 * @private
 */
epiviz.ui.WebArgsManager.prototype._updateUrl = function() {
  var url = '?';
  var args = epiviz.ui.WebArgsManager.WEB_ARGS;

  // 'ws' and 'workspace' are arguments for the same functionality
  // (the latter is kept for backward compatibility)
  if (!('ws' in args) && 'workspace' in args) {
    args['ws'] = args['workspace'];
    delete args['workspace'];
  }

  for (var arg in args) {
    if (!args.hasOwnProperty(arg)) { continue; }

    if (Array.isArray(args[arg])) {
      var val;
      for (var i = 0; i < args[arg].length; ++i) {
        val = args[arg][i];
        if (val == undefined) { val = 'undefined'; }
        url += sprintf('%s[]=%s&', arg, val);
      }
    } else {
      val = args[arg];
      if (val == undefined) { val = 'undefined'; }
      url += sprintf('%s=%s&', arg, val);
    }
  }

  // IE versions before 10 don't support the history API
  var ie = epiviz.utils.getInternetExplorerVersion();
  if (ie < 0 || ie >= 10) {
    switch(window.location.protocol) {
      case 'http:':
      case 'https:':
        //remote file over http or https
        history.replaceState(null, '', url);
        break;
      case 'file:':
        //local file
        break;
      default:
      //some other protocol
    }
  }
};

/**
 * @private
 */
epiviz.ui.WebArgsManager.prototype._registerLocationChanged = function() {
  var self = this;
  this._locationManager.onCurrentLocationChanged().addListener(new epiviz.events.EventListener(
    /**
     * @param {{oldValue: epiviz.datatypes.GenomicRange, newValue: epiviz.datatypes.GenomicRange}} e
     */
    function(e) {
      epiviz.ui.WebArgsManager.WEB_ARGS['seqName'] = e.newValue.seqName();
      epiviz.ui.WebArgsManager.WEB_ARGS['start'] = e.newValue.start();
      epiviz.ui.WebArgsManager.WEB_ARGS['end'] = e.newValue.end();

      self._updateUrl();
    }));
};

/**
 * @private
 */
epiviz.ui.WebArgsManager.prototype._registerActiveWorkspaceChanged = function() {
  var self = this;
  this._workspaceManager.onActiveWorkspaceChanged().addListener(new epiviz.events.EventListener(
    /**
     * @param {{oldValue: epiviz.workspaces.Workspace, newValue: epiviz.workspaces.Workspace, workspaceId: string}} e
     */
    function(e) {
      epiviz.ui.WebArgsManager.WEB_ARGS['ws'] = e.workspaceId || '';
      delete epiviz.ui.WebArgsManager.WEB_ARGS['workspace'];

      self._updateUrl();
    }
  ));
};
