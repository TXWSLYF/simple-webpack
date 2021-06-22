(function (modules) {
  const installedModules = {};
  function require(id) {
    // 解决循环依赖
    if (installedModules[id]) {
      return installedModules[id].exports;
    }
    var module = (installedModules[id] = { exports: {} });
    modules[id].call(module.exports, module, module.exports, require);
    return module.exports;
  }
  return require("/Users/luyufeng/code/github/simple-webpack/example/index.js");
})({
  "/Users/luyufeng/code/github/simple-webpack/example/index.js": function (
    module,
    exports,
    require
  ) {
    "use strict";

    var _add = require("./add.js");

    var _sum = require("./sum.js");

    console.log((0, _add.add)(1, 2));
    console.log((0, _sum.sum)(1, 2));
  },
  "./add.js": function (module, exports, require) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    exports.add = void 0;

    var _sum = require("./sum.js");

    var add = function add(a, b) {
      return (0, _sum.sum)(a, b);
    };

    exports.add = add;
  },
  "./sum.js": function (module, exports, require) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    exports.sum = void 0;

    var sum = function sum(c, d) {
      return c + d;
    };

    exports.sum = sum;
  },
  "./sum.js": function (module, exports, require) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true,
    });
    exports.sum = void 0;

    var sum = function sum(c, d) {
      return c + d;
    };

    exports.sum = sum;
  },
});
