import { init,parse } from "es-module-lexer";


(
  async function () {
    const sourceCode=`import _ from 'lodash';\nexport var age=15;`
    await init;
    parse(sourceCode)
    
  }
)()