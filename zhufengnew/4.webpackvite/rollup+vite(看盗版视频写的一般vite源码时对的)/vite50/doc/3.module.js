const { init, parse } = require('es-module-lexer');

(async function () {
  const sourceCode = `import _ from 'lodash';\nexport var age = 15;`;

  // 确保初始化完成
  await init;

  // 解析源代码
  const [imports,exports] = parse(sourceCode);

  // 输出解析结果
  console.log(imports,exports, 'result');
})();
