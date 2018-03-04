var _ = require('lodash');
const uuidv5 = require('uuid/v5');

module.exports = (function () {
  var _isNullOrWhiteSpace = function (str) {
    return _.isNil(str) || _.isNaN(str) || _.trim(str) == "";
  }

  var _first = function (str, length) {
    if (!str || str.length <= 0 || length <= 0) {
      return "";
    }
    if (length >= str.length) {
      return str;
    }
    return str.substr(0, length);
  }

  var _last = function (str, length) {
    if (!str || str.length <= 0 || length <= 0) {
      return "";
    }
    if (length >= str.length) {
      return str;
    }
    return str.slice(-1 * length);
  }

  var _before = function (str, subStr) {
    if (!str || str.length <= 0) {
      return "";
    }
    var idx = str.indexOf(subStr);
    if (idx < 0 || subStr.length <= 0) {
      return str;
    }
    return _first(str, str.length - idx);
  }

  var _after = function (str, subStr) {
    if (!str || str.length <= 0) {
      return "";
    }
    var idx = str.indexOf(subStr);
    if (idx < 0 || subStr.length <= 0) {
      return str;
    }
    return _last(str, str.length - idx - subStr.length);
  }

  //include the end character
  var _between = function (str, start, end) {
    if (!str || str.length <= 0 || start < 0) {
      return "";
    }

    var length = 0;
    if (!_isNullOrWhiteSpace(end)) {
      length = end - start;
    }
    else {
      length = str.length - start;
    }
    if (length < 0) {
      return str;
    }
    return str.substr(start, length + 1);
  }

  var _htmlEncode = function (str) {
    var ele = document.createElement('span');
    ele.appendChild(document.createTextNode(str));
    return ele.innerHTML;
  }

  var _randomString = function (length) {
    var result = Math.abs(Math.random()).toString(36).substring(2) + new Date().getTime();
    if (length > 2) {
      while (result.length < length) {
        result += Math.abs(Math.random()).toString(36).substring(2) + new Date().getTime();
      }
      result = result.substring(2, length + 2);
    }
    return result;
  }

  var _dataLength = function (str) {
    if (!str || str.length <= 0) {
      return 0;
    }
    return str.replace(/[^\x00-\xff]/g, "aa").length;
  }

  var _guid = function (ns) {
    if (!ns) {
      ns = "www.wanxinyong.com";
    }
    return uuidv5(ns, uuidv5.DNS);
  }

  var _format = function (str) {
    if (arguments.length > 1) {
      if (arguments.length == 2 && typeof (arguments[1]) == "object") {
        var args = arguments[1];
        for (var key in args) {
          if (args[key] != undefined) {
            var reg = new RegExp("({" + key + "})", "g");
            str = str.replace(reg, args[key]);
          }
        }
      }
      else {
        var args = arguments,
          re = new RegExp("{([0-" + (args.length - 1) + "])}", "g");
        str = str.replace(re, ($1, $2) => {
          var idx = parseInt($2) + 1;
          if (idx) {
            return args[idx];
          }
        });
        // console.log("result---->",str)
      }
    }
    return str;
  }

  var _getValue = function (val) {
    if (_isNullOrWhiteSpace(val)) {
      return "";
    }
    return val;
  }

  return {
    isNullOrWhiteSpace: _isNullOrWhiteSpace,
    first: _first,
    last: _last,
    before: _before,
    after: _after,
    between: _between,
    htmlEncode: _htmlEncode,
    randomString: _randomString,
    dataLength: _dataLength,
    guid: _guid,
    format: _format,
    getValue: _getValue
  }
})();