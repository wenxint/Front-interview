function buildTree(flatArr, rootId = 0) {
        // 使用Map存储节点引用，优化查找效率
        const nodeMap = new Map();
        const tree = [];

        // 第一次遍历：建立id到节点的映射，并初始化children数组
        flatArr.forEach((node) => {
          nodeMap.set(node.id, { ...node, children: [] });
        });

        // 第二次遍历：构建树形结构
        flatArr.forEach((node) => {
          const currentNode = nodeMap.get(node.id);
          const parentNode = nodeMap.get(node.parent_id);

          if (parentNode) {
            // 存在父节点，添加到父节点的children
            parentNode.children.push(currentNode);
          } else if (node.parent_id === rootId) {
            // 根节点直接添加到树
            tree.push(currentNode);
          }
        });

        return tree;
      }

      // 使用示例
      const flatArr = [
        { id: 1, title: "title1", parent_id: 0 },
        { id: 2, title: "title2", parent_id: 0 },
        { id: 3, title: "title2-1", parent_id: 2 },
        { id: 4, title: "title3-1", parent_id: 3 },
        { id: 5, title: "title4-1", parent_id: 4 },
        { id: 6, title: "title3-2", parent_id: 3 },
      ];

      const tree = buildTree(flatArr);