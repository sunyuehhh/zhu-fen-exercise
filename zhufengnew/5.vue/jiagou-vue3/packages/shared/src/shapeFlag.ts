export const enum ShapeFlags {
  ELEMENT = 1,                                 // 普通元素
  FUNCTIONAL_COMPONENT = 1 << 1,               // 函数组件
  STATEFUL_COMPONENT = 1 << 2,                 // 有状态组件（class 或 option API）
  TEXT_CHILDREN = 1 << 3,                      // 子节点是纯文本
  ARRAY_CHILDREN = 1 << 4,                     // 子节点是数组
  SLOTS_CHILDREN = 1 << 5,                     // 子节点是插槽
  TELEPORT = 1 << 6,                           // 是 Teleport 组件
  SUSPENSE = 1 << 7,                           // 是 Suspense 组件
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,        // 应该被 KeepAlive 缓存
  COMPONENT_KEPT_ALIVE = 1 << 9,               // 已被 KeepAlive 缓存
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT // 是组件（函数式或有状态）
}
