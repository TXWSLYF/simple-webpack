const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const { transformFromAstSync } = require("@babel/core");

/**
 * @param {string} filePath
 * @returns {filePath: string}
 */
readCode = (filePath) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const ast = parser.parse(content, { sourceType: "module" });

  const dependiences = [];
  // 遍历 ast，找出依赖
  traverse(ast, {
    ImportDeclaration({ node }) {
      // 改为从绝对路径 import
      node.source.value = path.resolve(
        path.dirname(filePath),
        node.source.value
      );
      dependiences.push(node.source.value);
    },
  });

  // 把 es6 转成 es5 字符串
  // 最重要的是把 esModule 的 import export，转成 es5 能认识的 commonJs写法
  const { code } = transformFromAstSync(ast, null, {
    presets: ["@babel/preset-env"],
  });

  return {
    filePath,
    code,
    dependiences,
  };
};

// 广度优先遍历算法，找出所有依赖项
const getAllDependencies = (filePath) => {
  const entryObj = readCode(filePath);
  const dependencies = [entryObj];

  for (const dependency of dependencies) {
    for (const absolutePath of dependency.dependiences) {
      const child = readCode(absolutePath);
      child.filePath = absolutePath;
      dependencies.push(child);
    }
  }

  return dependencies;
};

function bundle(fileName) {
  const dependencies = getAllDependencies(fileName);
  const cache = {};
  let modulesStr = "";
  dependencies.forEach((dependency) => {
    const key = dependency.filePath;
    if (cache[key]) return;

    cache[key] = true;
    modulesStr += `'${key}': function(module, exports, require) {
          ${dependency.code}
      },`;
  });
  return `(function(modules) {
      const installedModules = {};
      function require(id) {
          // 解决循环依赖
          if (installedModules[id]) {
              return installedModules[id].exports;
          }
          var module = installedModules[id] = {exports: {}};
          modules[id].call(module.exports, module, module.exports, require);
          return module.exports;
      }
      return require('${fileName}')
  })({${modulesStr}})`;
}

module.exports = {
  readCode,
  getAllDependencies,
  bundle,
};
