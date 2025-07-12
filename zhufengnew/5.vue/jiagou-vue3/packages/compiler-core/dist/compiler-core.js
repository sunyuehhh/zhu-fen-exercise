// packages/shared/src/index.ts
function isString(value) {
  return typeof value == "string";
}

// packages/compiler-core/src/parse.ts
function createParserContext(template) {
  return {
    line: 1,
    //行号
    column: 1,
    //列号
    offset: 0,
    //偏移量
    source: template,
    //会不停得截取  知道字符串为空得时候
    originalSource: template
  };
}
function isEnd(context) {
  if (context.source.startsWith("</")) {
    return true;
  }
  const source = context.source;
  return !source;
}
function getSelection(context, start, end) {
  end = getCursor(context);
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset)
  };
}
function getCursor(context) {
  let { line, column, offset } = context;
  return {
    line,
    column,
    offset
  };
}
function advanceBy(context, endIndex) {
  let source = context.source;
  context.source = source.slice(endIndex);
}
function advancePositionWithMutation(context, source, endIndex) {
  let linesCount = 0;
  let linePos = -1;
  for (let i = 0; i < endIndex; i++) {
    if (source[i]?.charCodeAt(0) === 10) {
      linesCount++;
      linePos = i;
    }
  }
  context.line += linesCount;
  context.offset += endIndex;
  context.column = linePos == -1 ? context.column + endIndex : endIndex - linePos;
}
function parserTextData(context, endIndex) {
  const content = context.source.slice(0, endIndex);
  advanceBy(context, endIndex);
  let source = context.source;
  advancePositionWithMutation(context, source, endIndex);
  return content;
}
function parserText(context) {
  let endTokens = ["<", "{{"];
  let endIndex = context.source.length;
  let start = getCursor(context);
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i], 1);
    if (index > -1 && index < endIndex) {
      endIndex = index;
    }
  }
  const content = parserTextData(context, endIndex);
  return {
    type: 2 /* TEXT */,
    content,
    loc: getSelection(context, start)
  };
}
function parserInterpolation(context) {
  const start = getCursor(context);
  const clonseIndex = context.source.indexOf("}}", 2);
  advanceBy(context, 2);
  const innerStart = getCursor(context);
  const rawContentEndIndex = clonseIndex - 2;
  const preTrimContent = parserTextData(context, rawContentEndIndex);
  const innerEnd = getCursor(context);
  const content = preTrimContent.trim();
  advanceBy(context, 2);
  return {
    type: 5 /* INTERPOLATION */,
    content: {
      type: 4 /* SIMPLE_EXPRESSION */,
      isStatic: false,
      content,
      loc: getSelection(context, innerStart, innerEnd)
    },
    loc: getSelection(context, start)
  };
}
function advanceBySpaces(context) {
  const match = /^[ \t\r\n]+/.exec(context.source);
  if (match) {
    advanceBy(context, match[0].length);
  }
}
function parseAttributeValue(context) {
  const quate = context.source[0];
  const isQuoted = quate === "'" || quate === '"';
  let content;
  if (isQuoted) {
    advanceBy(context, 1);
    const endIndex = context.source.indexOf(quate);
    content = parserTextData(context, endIndex);
    advanceBy(context, 1);
    return content;
  } else {
  }
}
function parseAttribute(context) {
  const start = getCursor(context);
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source);
  const name = match[0];
  advanceBy(context, name.length);
  let value;
  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    advanceBySpaces(context);
    advanceBy(context, 1);
    advanceBySpaces(context);
    value = parseAttributeValue(context);
  }
  return {
    type: 6 /* ATTRIBUTE */,
    name,
    value: {
      content: value
    },
    toc: getSelection(context, start)
  };
}
function parseChildrenAttribute(context) {
  const props = [];
  while (!context.source.startsWith(">")) {
    const prop = parseAttribute(context);
    props.push(prop);
  }
  return props;
}
function parserTag(context) {
  const start = getCursor(context);
  const match = /^<\/?([a-z][^\t\r\n />]*)/i.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceBySpaces(context);
  let props = parseChildrenAttribute(context);
  let isSelfClosing = context.source.startsWith("/>");
  advanceBy(context, isSelfClosing ? 2 : 1);
  return {
    tag,
    props,
    type: 1 /* ELEMENT */,
    isSelfClosing,
    loc: getSelection(context, start)
  };
}
function parserChildren(context) {
  const nodes = [];
  while (!isEnd(context)) {
    const s = context.source;
    let node;
    if (s[0] === "<") {
      node = parserTag(context);
      node.children = parserChildren(context);
      if (context.source.startsWith("/>")) {
        parserTag(context);
      }
      node.loc = getSelection(context, node.loc.start);
    } else if (s.startsWith("{{")) {
      node = parserInterpolation(context);
    }
    if (!node) {
      node = parserText(context);
    }
    nodes.push(node);
  }
  return nodes;
}
function createRoot(children, loc) {
  return {
    type: 0 /* ROOT */,
    children,
    loc
  };
}
function parser(template) {
  const context = createParserContext(template);
  const start = getCursor(context);
  return createRoot(parserChildren(context), getSelection(context, start));
}

// packages/compiler-core/src/runtimeHelpers.ts
var TO_DISPLAY_STRING = Symbol("toDisplayString");
var CREATE_TEXT = Symbol("createTextVNode");
var CREATE_ELEMENT_VNODE = Symbol("createElementVNode");
var OPEN_BLOCK = Symbol("openBlock");
var CREATE_ELEMENT_BLOCK = Symbol("createElementBlock");
var FRAGMENT = Symbol("fragment");
var helpNameMap = {
  [TO_DISPLAY_STRING]: "toDisplayString",
  [CREATE_TEXT]: "createTextVNode",
  [CREATE_ELEMENT_VNODE]: "createElementVNode",
  [OPEN_BLOCK]: "openBlock",
  [CREATE_ELEMENT_BLOCK]: "createElementBlock",
  [FRAGMENT]: "fragment"
};
function createCallExpression(context, args) {
  context.helper(CREATE_TEXT);
  return {
    type: 14 /* JS_CALL_EXPRESSION */,
    arguments: args
  };
}
function createVNodeCall(context, tag, props, children) {
  context.helper(CREATE_ELEMENT_VNODE);
  return {
    type: 13 /* VNODE_CALL */,
    //createElementVNode()
    tag,
    props,
    children
  };
}
function createObjectExpression(properties) {
  return {
    type: 15 /* JS_OBJECT_EXPRESSION */,
    properties
  };
}

// packages/compiler-core/src/transform.ts
function transformExpression(node, context) {
  if (node.type === 5 /* INTERPOLATION */) {
    console.log("\u8868\u8FBE\u5F0F\u8FDB\u5165", node, context);
    node.content.content = `_ctx.${node.content.content}`;
    return () => {
    };
  }
}
function transformElement(node, context) {
  if (node.type === 1 /* ELEMENT */) {
    console.log("\u5143\u7D20\u8FDB\u5165", node, context);
    return () => {
      console.log("\u5143\u7D20\u63A8\u51FA");
      const properties = [];
      const props = node.props;
      for (let i = 0; i < props.length; i++) {
        let { name, value } = props[i];
        properties.push({
          key: name,
          value: value.content
        });
      }
      const vnodeProps = properties.length > 0 ? createObjectExpression(properties) : null;
      const vnodeTag = JSON.stringify(node.tag);
      let vnodeChildren = null;
      if (node.children.length === 1) {
        vnodeChildren = node.children[0];
      } else {
        if (node.children.length > 1) {
          vnodeChildren = node.children;
        }
      }
      return node.codegenNode = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren
      );
    };
  }
}
function isText(node) {
  return node.type === 5 /* INTERPOLATION */ || node.type == 2 /* TEXT */;
}
function transformText(node, context) {
  if (node.type === 2 /* TEXT */ || node.type === 5 /* INTERPOLATION */) {
    console.log("\u6587\u672C\u8FDB\u5165", node, context);
    return () => {
      let hasText = false;
      const children = node.children;
      let currentContainer;
      for (let i = 0; i < children?.length; i++) {
        let child = children[i];
        if (isText(child)) {
          hasText = true;
          for (let j = i + 1; j < children?.length; j++) {
            const nextNode = children[j];
            if (isText(nextNode)) {
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: 8 /* COMPOUND_EXPRESSION */,
                  //组合表达式
                  children: [child]
                };
              }
              currentContainer.children.push(nextNode);
              children.splice(j, 1);
              j--;
            } else {
              currentContainer = null;
            }
          }
        }
      }
      if (!hasText || children.length == 1) {
        return;
      }
      for (let i = 0; i < children?.length; i++) {
        const child = children[i];
        if (isText(child) || child.type == 8 /* COMPOUND_EXPRESSION */) {
          const callArgs = [];
          callArgs.push(child);
          if (child.type !== 2 /* TEXT */) {
            callArgs.push("PatchFlags.TEXT");
          }
          children[i] = {
            // type是ast的标识
            type: 12 /* TEXT_CALL */,
            //生成文本调用
            content: child,
            // 生成代码  再transform中会生成一些额外的信息 用于代码生成ed
            codegenNode: createCallExpression(context, callArgs)
          };
        }
      }
      console.log("\u6587\u672C\u63A8\u51FA");
    };
  }
}
function createTransformContext(root) {
  const context = {
    currentNode: root,
    parent: null,
    helpers: /* @__PURE__ */ new Map(),
    //用于存储用的方法
    helper(name) {
      const count = context.helpers.get(name) || 0;
      context.helpers.set(name, count + 1);
      return name;
    },
    removeHelper(name) {
      const count = context.helpers.get(name);
      const currentCount = count - 1;
      if (!currentCount) {
        context.helpers.delete(name);
      } else {
        context.helpers.set(name, currentCount);
      }
    },
    nodeTransform: [
      transformExpression,
      transformElement,
      transformText
    ]
  };
  return context;
}
function traverseNode(node, context) {
  console.log(node, context, "traverseNode");
  context.currentNode = node;
  const transforms = context.nodeTransform;
  let exitFns = [];
  for (let i = 0; i < transforms.length; i++) {
    let exitFn = transforms[i](node, context);
    exitFn && exitFns.push(exitFn);
  }
  switch (node.type) {
    case 0 /* ROOT */:
    case 1 /* ELEMENT */:
      for (let i = 0; i < node.children.length; i++) {
        context.parent = node;
        traverseNode(node.children[i], context);
      }
    case 5 /* INTERPOLATION */:
      context.helper(TO_DISPLAY_STRING);
      break;
  }
  let len = exitFns.length;
  context.currentNode = node;
  while (len--) {
    exitFns[len]();
  }
}
function createRootCodegen(root, context) {
  const { children } = root;
  if (children.length == 1) {
    const child = children[0];
    if (child.type === 1 /* ELEMENT */) {
      root.codegenNode = child.codegenNode;
      context.removeHelper(CREATE_ELEMENT_VNODE);
      context.helper(OPEN_BLOCK);
      context.helper(CREATE_ELEMENT_BLOCK);
      root.codegenNode.isBlock = true;
    } else {
      root.codegenNode = child;
    }
  } else {
    context.helper(OPEN_BLOCK);
    context.helper(CREATE_ELEMENT_BLOCK);
    root.codegenNode = createVNodeCall(
      context,
      context.helper(FRAGMENT),
      null,
      children
    );
  }
}
function transform(root) {
  const context = createTransformContext(root);
  traverseNode(root, context);
  createRootCodegen(root, context);
  root.helpers = [...context.helpers.keys()];
}

// packages/compiler-core/src/index.ts
function createCodegenContext() {
  const context = {
    helper: (type) => "_" + helpNameMap[type],
    code: ``,
    //存储拼接后的代码
    push(code) {
      context.code += code;
    },
    level: 0,
    indent() {
      context.newLine(++context.level);
    },
    deindent(needNewLine = false) {
      if (!needNewLine) {
        --context.level;
      } else {
        context.newLine(--context.level);
      }
    },
    newLine(level = context.level) {
      context.push("\n" + " ".repeat(level));
    }
  };
  return context;
}
function genText(node, context) {
  context.push(JSON.stringify(node.content));
}
function genFunctionPreamble(ast, context) {
  if (ast.helpers.length > 0) {
    context.push(
      `import {${ast.helpers.map((helper) => `${helpNameMap[helper]} as _${helpNameMap[helper]}`).join(",")}} from "vue"`
    );
    context.newLine();
  }
}
function genInterpolation(node, context) {
  context.push(`${context.helper(TO_DISPLAY_STRING)}(`);
  genNode(node.content, context);
  context.push(")");
}
function genExpression(node, context) {
  context.push(node.content);
}
function genList(list, context) {
  for (let i = 0; i < list.length; i++) {
    let node = list[i];
    if (isString(node)) {
      context.push(node);
    } else if (Array.isArray(node)) {
      genList(node, context);
    } else {
      genNode(node, context);
    }
    if (i < list.length - 1) {
      context.push(",");
    }
  }
}
function genVNodeCall(node, context) {
  const { push, helper } = context;
  const { tag, props, children, isBlock } = node;
  if (isBlock) {
    push(`(${helper(OPEN_BLOCK)}(),`);
  }
  if (isBlock) {
    push(helper(CREATE_ELEMENT_BLOCK));
  } else {
    push(helper(CREATE_ELEMENT_VNODE));
  }
  push("(");
  let list = [tag, props, children].filter(Boolean);
  genList([tag, props, children].map((item) => item || "undefined"), context);
  push(")");
  if (isBlock) {
    push(")");
  }
}
function genObjectExpression(node, context) {
  const { properties } = node;
  const { push } = context;
  if (!properties) {
    return;
  }
  push("{");
  for (let i = 0; i < properties.length; i++) {
    const { key, value } = properties[i];
    push(key);
    push(":");
    push(JSON.stringify(value));
    if (i < properties.length - 1) {
      push(",");
    }
  }
  push("}");
}
function genCallExpression(node, context) {
  context.push(context.helper(CREATE_TEXT));
  context.push("(");
  genList(node.arguments, context);
  context.push(")");
}
function genCompoundExpression(node, context) {
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (isString(child)) {
      context.push(child);
    } else {
      genNode(child, context);
    }
  }
}
function genNode(node, context) {
  if (typeof node === "symbol") {
    context.push(context.helper(FRAGMENT));
    return;
  }
  switch (node.type) {
    case 2 /* TEXT */:
      genText(node, context);
      break;
    case 5 /* INTERPOLATION */:
      genInterpolation(node, context);
      break;
    case 4 /* SIMPLE_EXPRESSION */:
      genExpression(node, context);
      break;
    case 13 /* VNODE_CALL */:
      genVNodeCall(node, context);
      break;
    case 15 /* JS_OBJECT_EXPRESSION */:
      genObjectExpression(node, context);
      break;
    case 1 /* ELEMENT */:
      genNode(node.codegenNode, context);
      break;
    case 12 /* TEXT_CALL */:
      genNode(node.codegenNode, context);
      break;
    case 20 /* JS_CACHE_EXPRESSION */:
      genCallExpression(node.codegenNode, context);
      break;
    case 8 /* COMPOUND_EXPRESSION */:
      genCompoundExpression(node, context);
  }
}
function generate(ast) {
  const context = createCodegenContext();
  genFunctionPreamble(ast, context);
  context.push(
    `export function (_ctx, _cache, $props, $setup, $data, $options){`
  );
  context.indent();
  context.push(`return `);
  if (ast.codegenNode) {
    genNode(ast.codegenNode, context);
  } else {
    context.push(null);
  }
  context.newLine();
  context.push("}");
  console.log(context.code, "context.code");
  return context.code;
}
function compile(template) {
  const ast = parser(template);
  console.log(ast, "ast");
  transform(ast);
  generate(ast);
  return;
}
export {
  compile
};
//# sourceMappingURL=compiler-core.js.map
