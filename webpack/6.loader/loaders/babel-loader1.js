const babel = require("@babel/core");
const path = require("path");
function loader(source, ast, inputSourceMap) {
  // 在loader里面   this其实是一个称为loaderContext的对象
  const callback = this.async();
  let options = this.getOptions();
  let babelOptions = {
    ...options,
    sourceMaps: true, //当前转换babel的时候要生成的sourcemap
    inputSourceMap, //接收上一份的sourcemap
    ast:true
  };
  //   map就是sourcemap,可以把转换前的代码行列和转换后的代码行列进行映射
  const result = babel.transformAsync(source, babelOptions).then(({ code }) => {
    // 在loader执行完成之后才让调用callback  表示loader已经完成了，才能执行下面的loader
    console.log(code,'code')
    callback(null, code);
  });
}

module.exports = loader;

// function loader(source) {
//     // 在loader里面   this其实是一个称为loaderContext的对象
//     let options = this.getOptions();
//     const result = babel.transformSync(source, options);
//     return result.code;
//   }
