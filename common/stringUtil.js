'use strict'

var stringUtil = (function() {
  //a map for the private members
  var wm = new WeakMap();
  class stringUtil {
    static first(str, length) {
      if (!str || str.length <= 0 || length <= 0) {
        return "";
      }
      if (length >= str.length) {
        return str;
      }
      return str.substr(0, length);
    }

    static last(str, length) {
      if (!str || str.length <= 0 || length <= 0) {
        return "";
      }
      if (length >= str.length) {
        return str;
      }
      return str.slice(-1 * length);
    }
  }
  return stringUtil;
})();

export default stringUtil;
