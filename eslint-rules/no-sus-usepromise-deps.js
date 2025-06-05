export default {
  meta: {
    type: "problem", // This rule flags a potential bug
    docs: {
      description: "检查usePromise依赖",
    },
    schema: [],
    messages: {
      inlineFn: "在依赖数组中使用内联函数毫无意义，因为这会使得usePromise在每次渲染触发。如果这是你的目的，请将依赖数组设置为undefined。",
      nonMemoFn: "函数 '{{name}}' 是不稳定的，这有可能导致usePromise在每次渲染时触发。请考虑将该函数的定义移动到顶层或者使用useCallback。"
    }
  },

  create(context) {
    // 2. Helper to detect useCallback initialization (unchanged)
    function isMemoizedWithUseCallback(binding) {
      if (!binding) return false;
      const def = binding.defs[0];
      if (!def || def.type !== "Variable") return false;
      const init = def.node.init;
      if (!init || init.type !== "CallExpression") return false;

      // Looks for both `useCallback(...)` and `React.useCallback(...)`
      if (init.callee.type === "Identifier" && init.callee.name === "useCallback") {
        return true;
      }
      if (
        init.callee.type === "MemberExpression" &&
        init.callee.property.type === "Identifier" &&
        init.callee.property.name === "useCallback"
      ) {
        return true;
      }
      return false;
    }

    return {
      CallExpression(node) {
        // 判断调用是否为 usePromise
        if (node.callee.name !== "usePromise") return;

        // 4. The dependency array is assumed at index 1: useMyHook(fn, [deps...])
        const depsArg = node.arguments[2];
        if (!depsArg || depsArg.type !== "ArrayExpression") {
          return; // no literal array passed
        }

        // 5. Get the new SourceCode object to fetch scope information
        const sourceCode = context.sourceCode ?? context.getSourceCode();

        // 6. For each element in the dependency array, check stability
        depsArg.elements.forEach((element) => {
          if (!element) return; // skip holes like [ , foo ]

          // 6A. If it’s an inline function literal → always report
          if (
            element.type === "ArrowFunctionExpression" ||
            element.type === "FunctionExpression"
          ) {
            context.report({
              node: element,
              messageId: "inlineFn"
            });
            return;
          }

          // 6B. If it’s an Identifier (e.g. someLocalFn), climb scopes to find binding
          if (element.type === "Identifier") {
            const varName = element.name;

            // Climb up from the current node’s scope
            let binding = null;
            // get the scope associated with the array element’s AST node:
            let currentScope = sourceCode.getScope(element);

            // Walk up until we find the variable or run out of scopes
            while (currentScope) {
              const maybe = currentScope.set.get(varName);
              if (maybe) {
                binding = maybe;
                break;
              }
              currentScope = currentScope.upper;
            }
            if (!binding) {
              // No local binding → imported or global → skip
              return;
            }
            if (binding.scope.type === "module") {
              return
            }

            // 6B-1: If that binding was initialized by useCallback, it’s stable
            if (isMemoizedWithUseCallback(binding)) {
              return;
            }

            const def = binding.defs[0];
            if (!def) return;

            // 6B-2: If it was declared as `function fn() { … }` in this scope
            if (
              def.node.type === "FunctionDeclaration"
            ) {
              context.report({
                node: element,
                messageId: "nonMemoFn",
                data: { name: varName }
              });
              return;
            }

            // 6B-3: If it was declared as `const fn = () => { … }` or `const fn = function() { … }`
            if (
              def.node.type === "VariableDeclarator" &&
              def.node.init
              && (def.node.init.type === "ArrowFunctionExpression" ||
                def.node.init.type === "FunctionExpression")
            ) {
              context.report({
                node: element,
                messageId: "nonMemoFn",
                data: { name: varName }
              });
              return;
            }

            // Otherwise (imported functions, class methods, etc.), skip
            return;
          }

          // 6C. Other node types (MemberExpression, CallExpression, etc.) → skip
        });
      }
    };
  }
};
