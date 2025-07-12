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
var TO_DISPLAY_STRING = Symbol();
var helpNameMap = {
  [TO_DISPLAY_STRING]: "toDisplayString"
};

// packages/compiler-core/src/index.ts
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
    };
  }
}
function transformText(node, context) {
  if (node.type === 2 /* TEXT */ || node.type === 5 /* INTERPOLATION */) {
    console.log("\u6587\u672C\u8FDB\u5165", node, context);
    return () => {
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
function transform(root) {
  const context = createTransformContext(root);
  traverseNode(root, context);
}
function compile(template) {
  const ast = parser(template);
  console.log(ast, "ast");
  transform(ast);
  return;
}
export {
  compile
};
//# sourceMappingURL=compiler-core.js.map
