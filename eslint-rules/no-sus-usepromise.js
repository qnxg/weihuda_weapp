export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "usePromise调用风格检查",
    },
    schema: [] // 无额外配置
  },
  create(context) {
    return {
      CallExpression(node) {
        // 判断调用是否为 usePromise
        if (node.callee.name !== "usePromise") return;
        const args = node.arguments;
        if (args.length < 1) return;
        const firstArg = args[0];
        const thirdArg = args[2];

        // 1. 检查第一个参数是否为 inline 函数
        if (
          firstArg.type === "ArrowFunctionExpression"
          || firstArg.type === "FunctionExpression"
        ) {
          context.report({
            node: firstArg,
            message: `不应该使用内联函数作为usePromise的第一个参数。`
              + `这是因为内联函数的引用在每次渲染时都会变化，可能导致潜在的bug。`
              + `请将函数定义使用useCallback包裹或者提取至全局。`
          });
        } else if (thirdArg) {
          // 2. 当第一个参数不是 inline 函数时，如果第三个参数存在，则要求第三个参数为数组字面量
          if (thirdArg.type !== "ArrayExpression") {
            context.report({
              node: thirdArg,
              message: "usePromise的第三个参数为什么不是数组字面量？"
            });
          } else {
            // 检查数组是否包含第一个参数的引用（假设引用通过标识符判断）
            // 仅在 firstArg 为标识符的情况下进行检查
            if (firstArg.type === "Identifier") {
              const refName = firstArg.name;
              const contains = thirdArg.elements.some(element =>
                element && element.type === "Identifier" && element.name === refName
              );
              if (!contains) {
                context.report({
                  node: thirdArg,
                  message: `依赖数组中没有包含usePromise第一个参数。`
                    + `第一个参数的引用是否是稳定的？`
                    + `请检查，然后将其包含到依赖数组中。`
                });
              }
            }
          }
        }
      }
    };
  }
};