/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:24 PM
 */

goog.provide('epiviz.ui.charts.decoration.SaveChartButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @extends {epiviz.ui.charts.decoration.ChartOptionButton}
 * @constructor
 */
epiviz.ui.charts.decoration.SaveChartButton = function(visualization, otherDecoration) {
  epiviz.ui.charts.decoration.ChartOptionButton.call(this, visualization, otherDecoration);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.SaveChartButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.ChartOptionButton.prototype);
epiviz.ui.charts.decoration.SaveChartButton.constructor = epiviz.ui.charts.decoration.SaveChartButton;

/**
 * @returns {Function}
 * @protected
 */
epiviz.ui.charts.decoration.SaveChartButton.prototype._click = function() {
  var self = this;
  return function(){
    self.visualization().onSave().notify(new epiviz.ui.charts.VisEventArgs(self.visualization().id()));
  };
};

/**
 * @returns {*} jQuery button render options
 * @protected
 */
epiviz.ui.charts.decoration.SaveChartButton.prototype._renderOptions = function() {
  return {
    icons:{ primary:'ui-icon ui-icon-disk' },
    text:false
  };
};

/**
 * @returns {string}
 * @protected
 */
epiviz.ui.charts.decoration.SaveChartButton.prototype._text = function() { return 'Save'; };
