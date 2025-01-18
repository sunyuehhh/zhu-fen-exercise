const babel = require("@babel/core");
const path = require("path");
function loader(source) {
  // 在loader里面   this其实是一个称为loaderContext的对象
  const callback = this.async();
  let options = this.getOptions();
  //   map就是sourcemap,可以把转换前的代码行列和转换后的代码行列进行映射
  let babelOptions = {
    ...options,
    ast:true,
    sourceMaps: true, //生成sourcemap
  };
  babel.transformAsync(source, babelOptions).then(({code,ast,map} )=> {
    // 在loader执行完成之后才让调用callback  表示loader已经完成了，才能执行下面的loader
    callback(null, code, ast, map);
    // 可以向后一个loader传递多个参数
  });
}

module.exports = loader;

// function loader(source) {
//     // 在loader里面   this其实是一个称为loaderContext的对象
//     let options = this.getOptions();
//     const result = babel.transformSync(source, options);
//     return result.code;
//   }
