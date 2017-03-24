/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/10/2015
 * Time: 11:00 AM
 */

goog.provide('epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.MarkerCodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.MarkerCodeButton.prototype);
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.constructor = epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton;

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.markerType = function() { return epiviz.ui.charts.markers.VisualizationMarker.Type.ORDER_BY_MEASUREMENTS; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.markerLabel = function() { return 'Order By' };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.markerId = function() { return 'order-by-measurements'; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.preMarkTemplate = function() {
  return '/**\n' +
  ' * This method is called once before every draw, for all data available to the visualization,\n' +
  ' * for initialization. Its result can be used inside the filter method.\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @returns {InitialVars}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(data) {\n' +
  '  // TODO: Your code here\n' +
  '  return null;\n' +
  '}\n';
};

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.markTemplate = function() {
  return '/**\n' +
  ' * @param {epiviz.measurements.Measurement} m\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @param {InitialVars} [preMarkResult]\n' +
  ' * @returns {string|number}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(m, data, preMarkResult) {\n' +
  '  // TODO: Your code here\n' +
  '  return 0;\n' +
  '}\n';
};

