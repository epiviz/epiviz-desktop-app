/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/31/14
 * Time: 12:44 PM
 */

goog.provide('epiviz.ui.controls.DatasourceGroupWizardStep');

/**
 * @constructor
 * @implements {epiviz.ui.controls.Wizard.Step}
 */
epiviz.ui.controls.DatasourceGroupWizardStep = function() {
  /**
   * @type {?epiviz.ui.controls.DataTable}
   * @private
   */
  this._dataTable = null;

  /**
   * @type {epiviz.ui.controls.VisConfigSelection}
   * @private
   */
  this._data = null;
};

/**
 * @param {jQuery} container
 * @param {epiviz.ui.controls.VisConfigSelection} data
 */
epiviz.ui.controls.DatasourceGroupWizardStep.prototype.initialize = function(container, data) {
  this._data = data;

  container.find('.epiviz-data-table').remove();

  var columns = [
    new epiviz.ui.controls.DataTable.Column('datasourceGroup', 'Data Source Group', epiviz.ui.controls.DataTable.ColumnType.STRING)
  ];

  var datasourceGroups = {};
  data.measurements.foreach(function(m) {
    if (data.dataprovider && data.dataprovider != m.dataprovider()) { return; }
    if (data.annotation) {
      for (var key in data.annotation) {
        if (!data.annotation.hasOwnProperty(key)) { continue; }
        if (!m.annotation() || m.annotation()[key] != data.annotation[key]) { return; }
      }
    }

    datasourceGroups[m.datasourceGroup()] = true;
  });

  this._dataTable = new epiviz.ui.controls.DataTable(container, columns, new epiviz.utils.IterableArray(Object.keys(datasourceGroups)), function(v) { return v; });
  this._dataTable.initialize();
};

/**
 * Gets the selected datasource group, or, if
 * there is an error, success is set to false and errorMessage contains
 * the details of the error that occurred.
 *
 * @returns {{
 *   error: string=,
 *   data: epiviz.ui.controls.VisConfigSelection=}}
 */
epiviz.ui.controls.DatasourceGroupWizardStep.prototype.next = function() {
  var selectedRows = this._dataTable ? this._dataTable.selectedRows() : [];
  if (selectedRows.length == 0) {
    return {
      error: 'No rows selected'
    };
  }

  this._data.datasourceGroup = selectedRows[0];

  var copy = new epiviz.ui.controls.VisConfigSelection(
    this._data.measurements.subset(function(m) { return m.datasourceGroup() == selectedRows[0]; }),
    this._data.datasource,
    this._data.datasourceGroup,
    this._data.dataprovider,
    this._data.annotation ? epiviz.utils.mapCopy(this._data.annotation) : this._data.annotation,
    this._data.defaultChartType,
    this._data.minSelectedMeasurements,
    this._data.customData
  );

  return {
    data: copy
  };
};

epiviz.ui.controls.DatasourceGroupWizardStep.prototype.title = function() {
  return 'Select Datasource Group';
};
