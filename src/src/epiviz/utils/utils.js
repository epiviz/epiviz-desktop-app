/**
 * Created by: Florin Chelaru
 * Date: 10/4/13
 * Time: 11:19 AM
 */

goog.provide('epiviz.utils.capitalizeFirstLetter');
goog.provide('epiviz.utils.fillArray');
goog.provide('epiviz.utils.mapCopy');
goog.provide('epiviz.utils.evaluateFullyQualifiedTypeName');
goog.provide('epiviz.utils.generatePseudoGUID');

// String

/**
 * @param {string} str
 * @returns {string}
 */
epiviz.utils.capitalizeFirstLetter = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @param {string} str
 * @param {string} substr
 * @returns {boolean}
 */
epiviz.utils.stringContains = function(str, substr) {
  return str.indexOf(substr) != -1;
};

/**
 * @param {string} str
 * @param {string} prefix
 * @returns {boolean}
 */
epiviz.utils.stringStartsWith = function(str, prefix) {
  return str.indexOf(prefix) == 0;
};

/**
 * @param {string} str
 * @param {string} suffix
 * @returns {boolean}
 */
epiviz.utils.stringEndsWith = function(str, suffix) {
  return str.lastIndexOf(suffix) == str.length - suffix.length;
};

// Array

/**
 * Creates an array of length n filled with value
 * @param {number} n
 * @param {T} value
 * @returns {Array.<T>}
 * @template T
 */
epiviz.utils.fillArray = function(n, value) {
  n = n || 0;
  var result = new Array(n);
  for (var i = 0; i < n; ++i) {
    result[i] = value;
  }
  return result;
};

/**
 * @param {Array.<T>} arr
 * @param {function(T): boolean} predicate
 * @returns {number}
 * @template T
 */
epiviz.utils.indexOf = function(arr, predicate) {
  for (var i = 0; i < arr.length; ++i) {
    if (predicate(arr[i])) { return i; }
  }
  return -1;
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {boolean}
 */
epiviz.utils.arraysEqual = function(arr1, arr2) {
  if (arr1 == arr2) { return true; }

  if (!arr1 || !arr2) { return false; }

  if (arr1.length != arr2.length) { return false; }

  if (arr1 < arr2 || arr2 < arr1) { return false; }

  // The previous check doesn't work when the elements of the array are complex objects
  for (var i = 0; i < arr1.length; ++i) {
    if (arr1[i] != arr2[i]) { return false; }
  }
  return true;
};

/**
 * Compares the two given arrays ignoring the order of their elements;
 * for example [1, 2, 1, 3] and [2, 1, 1, 3] will be considered equal.
 * @param {Array.<string|number>} arr1
 * @param {Array.<string|number>} arr2
 * @returns {boolean}
 */
epiviz.utils.elementsEqual = function(arr1, arr2) {
  if (arr1 == arr2) { return true; }

  if (!arr1 || !arr2) { return false; }

  if (arr1.length != arr2.length) { return false; }

  var valueMap = {};

  var i;
  for (i = 0; i < arr1.length; ++i) {
    if (!(arr1[i] in valueMap)) { valueMap[arr1[i]] = 0; }
    ++valueMap[arr1[i]];
  }

  for (i = 0; i < arr2.length; ++i) {
    if (!valueMap[arr2[i]]) { return false; }
    --valueMap[arr2[i]];
  }

  return true;
};

/**
 * Generates an array of consecutive numbers starting from startIndex
 * (or 0 if it's not defined)
 * @param {number} n
 * @param {number} [startIndex]
 */
epiviz.utils.range = function(n, startIndex) {
  startIndex = startIndex || 0;
  n = n || 0;

  var result = new Array(n);
  for (var i = 0; i < n; ++i) {
    result[i] = i + startIndex;
  }

  return result;
};

/**
 * Append an array to another in place
 * @param {Array} self
 * @param {Array} arr
 */
epiviz.utils.arrayAppend = function(self, arr) {
  self.push.apply(self, arr);
};

/**
 * @param {Array.<string|number>} arr
 * @returns {Object.<string|number, number>}
 */
epiviz.utils.arrayFlip = function(arr) {
  var result = {};
  for (var i = 0; i < arr.length; ++i) {
    result[arr[i]] = i;
  }

  return result;
};

/**
 * Gets the minimum value in the matrix, along with the i, j indices where this value is located
 * @param {Array.<Array.<number>>} matrix
 * @param {boolean} [isSymmetrical]
 * @returns {{min: number, index: Array}}
 */
epiviz.utils.indexOfMin = function(matrix, isSymmetrical) {
  var ret = null;
  var min = null;
  for (var i = 0; i < matrix.length; ++i) {
    for (var j = isSymmetrical ? (i + 1) : 0; j < matrix[i].length; ++j) {
      if (min == null || matrix[i][j] < min) {
        min = matrix[i][j];
        ret = [i, j];
      }
    }
  }

  return {min: min, index: ret};
};

/**
 * @param {Array.<number|string>} arr1
 * @param {Array.<number|string>} arr2
 * @returns {Array.<number|string>}
 */
epiviz.utils.arrayIntersection = function(arr1, arr2) {
  var arr1Map = {};
  arr1.forEach(function(e) { arr1Map[e] = e; });

  var ret = [];
  arr2.forEach(function(e) { if (e in arr1Map) { ret.push(e); }});

  return ret;
};

/**
 * @param {number} n
 * @param {function(number, function(boolean))} iterationCallback The callback parameter will be true if should break
 * @param {function} finishedCallback
 */
epiviz.utils.asyncFor = function(n, iterationCallback, finishedCallback) {
  if (!n) {
    if (finishedCallback) { finishedCallback(); }
    return;
  }

  var iteration = function(i) {
    if (i >= n) {
      if (finishedCallback) { finishedCallback(); }
      return;
    }

    iterationCallback(i, function(result) {
      if (result) {
        if (finishedCallback) { finishedCallback(); }
      }
      else {
        iteration(i + 1);
      }
    });
  };

  iteration(0);
};

/**
 * @param {number} n
 * @param {function(number): epiviz.deferred.Deferred} deferredIteration
 * @returns {epiviz.deferred.Deferred}
 */
epiviz.utils.deferredFor = function(n, deferredIteration) {
  var initial = new epiviz.deferred.Deferred();
  var ret = new epiviz.deferred.Deferred();
  var p = initial.promise();
  for (var i = 0; i < n; ++i) {
    (function(i) {
      p = p.then(function () {
        var promise = deferredIteration(i);
        if (i == n - 1) {
          promise.then(function () { ret.resolve(); });
        }
        return promise;
      });
    })(i);
  }

  initial.resolve();
  return ret;
};

// Object (Hashtable)

/**
 * Creates a copy of the given map
 * @param {Object.<K, V>} map
 * @returns {Object.<K, V>}
 * @template K, V
 */
epiviz.utils.mapCopy = function(map) {
  var result = {};
  for (var key in map) {
    if (!map.hasOwnProperty(key)) { continue; }
    result[key] = map[key];
  }

  return result;
};

/**
 * @param {Object.<K, V>} m1
 * @param {Object.<K, V>} m2
 * @returns {boolean}
 * @template K, V
 */
epiviz.utils.mapEquals = function(m1, m2) {
  if (m1 == m2) { return true; }
  if (!m1 || !m2) { return false; }

  var k;
  for (k in m1) {
    if (!m1.hasOwnProperty(k)) { continue; }
    if (!m2.hasOwnProperty(k)) { return false; }
    if (m1[k] != m2[k]) { return false; }
  }

  for (k in m2) {
    if (!m2.hasOwnProperty(k)) { continue; }
    if (!m1.hasOwnProperty(k)) { return false; }
  }

  return true;
};

/**
 * Creates a new map that contains the keys of both m1 and m2.
 * If one key is in both maps, then the value from m1 will be used.
 * @param {Object<*,*>} m1
 * @param {Object<*,*>} m2
 * @param {boolean} [combineArrayVals] specifies that array values should also be combined
 * @returns {Object<*,*>}
 */
epiviz.utils.mapCombine = function(m1, m2, combineArrayVals) {
  var result = {};

  var key;

  if (m2) {
    for (key in m2) {
      if (!m2.hasOwnProperty(key)) { continue; }
      result[key] = m2[key];
    }
  }

  if (m1) {
    for (key in m1) {
      if (!m1.hasOwnProperty(key)) { continue; }
      if (combineArrayVals &&
        result[key] && $.isArray(result[key]) &&
        m1[key] && $.isArray(m1[key])) {
        result[key] = result[key].concat(m1[key]);
      } else {
        result[key] = m1[key];
      }
    }
  }

  return result;
};

/**
 * @param {Object.<*, *>} map
 * @param {string} [keyValueSep] Default: ':'
 * @param {string} [separator] Default: ','
 */
epiviz.utils.mapJoin = function(map, keyValueSep, separator) {
  if (!keyValueSep && keyValueSep !== '') { keyValueSep = ':'; }
  if (!separator && separator !== '') { separator = ','; }
  var result = '';
  for (var key in map) {
    if (!map.hasOwnProperty(key)) { continue; }
    if (result) { result += separator; }
    result += key + keyValueSep + map[key];
  }

  return result;
};

/**
 * Gets the keys that are in both maps
 * @param {Object.<*, *>} m1
 * @param {Object.<*, *>} m2
 * @returns {Array.<*>}
 */
epiviz.utils.mapKeyIntersection = function(m1, m2) {
  var result = [];

  if (!m1 || !m2) { return result; }

  for (var key in m1) {
    if (!m1.hasOwnProperty(key)) { continue; }
    if (key in m2) { result.push(key); }
  }

  return result;
};

/**
 * Loops through all the elements of an object or until callback returns something that evaluates to true
 * @param {Object.<string|number, T>} obj
 * @param {function(T=, string|number=, Object.<string|number, T>=)} callback
 * @template T
 */
epiviz.utils.forEach = function(obj, callback) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) { continue; }
    if (callback(obj[key], key, obj)) { break; }
  }
};

// Reflection

/**
 * Evaluates the given string into a constructor for a type
 * @param {string} typeName
 * @returns {?function(new: T)}
 * @template T
 */
epiviz.utils.evaluateFullyQualifiedTypeName = function(typeName) {
  try {
    var namespaces = typeName.split('.');
    var func = namespaces.pop();
    var context = window;
    for (var i = 0; i < namespaces.length; ++i) {
      context = context[namespaces[i]];
    }

    var result = context[func];
    if (typeof(result) !== 'function') {
      console.error('Unknown type name: ' + typeName);
      return null;
    }

    return result;
  } catch (error) {
    console.error('Unknown type name: ' + typeName);
    return null;
  }
};

/**
 * Applies the given constructor to the given parameters and creates
 * a new instance of the class it defines
 * @param {function(new: T)} ctor
 * @param {Array} params
 * @returns {T}
 * @template T
 */
epiviz.utils.applyConstructor = function(ctor, params) {
  var obj;

  // Use a fake constructor function with the target constructor's
  // `prototype` property to create the object with the right prototype
  var fakeCtor = function() {};
  fakeCtor.prototype = ctor.prototype;

  /** @type {T} */
  obj = new fakeCtor();

  // Set the object's `constructor`
  obj.constructor = ctor;

  // Call the constructor function
  ctor.apply(obj, params);

  return obj;
};

// Misc

/**
 * @const
 * @type {number}
 */
epiviz.utils.RAD_TO_DEG = 180 / Math.PI;

/**
 * @const
 * @type {number}
 */
epiviz.utils.DEG_TO_RAD = Math.PI / 180;

/**
 * @returns {number} The version of Internet Explorer or -1 (indicating the use of another browser).
 */
epiviz.utils.getInternetExplorerVersion = function() {
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    var match = re.exec(ua);
    if (match != null)
      rv = parseFloat(match[1]);
  }
  return rv;
};

/**
 * @param {number} size
 * @returns {string}
 */
epiviz.utils.generatePseudoGUID = function(size) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';

  for (var i = 0; i < size; ++i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }

  return result;
};

/**
 * This function will take a set of 3 "increasing" colors and
 * return a color scale that fills in intensities between the
 * colors. For use in turning each column of the observation
 * matrix into a heatmap.
 * @param {number} min
 * @param {number} max
 * @param {number} median
 * @param {string} colorMin
 * @param {string} colorMax
 * @param {string} colorMedian
 * @returns {function(number): string} A function that takes in a number and returns a color
 */
epiviz.utils.colorize = function(min, max, median, colorMin, colorMax, colorMedian){
  return d3.scale.linear()
    .domain([min, median, max])
    .range([colorMin, colorMedian, colorMax]);
};

/**
 * @param {number} min
 * @param {number} max
 * @param {string} colorMin
 * @param {string} colorMax
 * @returns {function(number): string}
 */
epiviz.utils.colorizeBinary = function(min, max, colorMin, colorMax){
  return d3.scale.linear()
    .domain([min, max])
    .range([colorMin, colorMax]);
};

// Math

/**
 * @param {number} val
 * @returns {number}
 */
epiviz.utils.sign = function(val) { return val < 0 ? -1 : (val == 0 ? 0 : 1); };
