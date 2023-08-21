import { deepClone, getChainKeysValue } from "./obj";

/**
 * 后端返回的字段可能和前端需要不符的情况下，用来改变树形结构的key
 * 例子：
 *  1.统一树形数据字段
 *  2.主动适配组件
 * @param {tree[]} list 树形列表
 * @param {Array<[string, string, Function?]>} changeKeys Array<[原始key, 最终key, changeFunc(item[原始key], item)]>
 * @param {string} childrenKey children属性key，默认为children
 * @returns {tree[]} 树形数组
 */
export const changeTreePropName = (list: any[], changeKeys: Array<[string, string, Function?]>, childrenKey?: string) => {
  if (!list || !list.length) {
    return [];
  }
  const _childrenKey = childrenKey || 'children';
  const cloneList = deepClone(list);
  return cloneList.map((item: any) => {
    changeKeys.forEach((keys) => {
      const changeFunc = keys[2];
      if (!changeFunc) {
        item[keys[1]] = item[keys[0]];
      } else {
        item[keys[1]] = changeFunc(item[keys[0]], item);
      }
    })
    if (item[_childrenKey] && item[_childrenKey].length) {
      item[_childrenKey] = changeTreePropName(item[_childrenKey], changeKeys, _childrenKey);
    }
    return item;
  });
}

/**
 * 把线性数据转成树形数据
 * @param {any[]} source 原数据List
 * @param {string} idKey id的key
 * @param {string} parentIdKey parentId的key 
 * @param {string} childrenKey 生成children的key
 * @param {string} topCode 顶级元素父元素的id
 * @returns {tree[]} 树形数组
 */
export function setTreeData(source: any[], idKey: string, parentIdKey: string, childrenKey: string, topCode?: string) {
  if (!source || !source.length) {
    return [];
  }
  const cloneData = deepClone(source) || [];
  const tree = cloneData.filter((father: any) => {
    const branchArr = cloneData.filter((child: any) => father[idKey] === child[parentIdKey]);
    if (branchArr.length > 0) {
      // 将孩子放入到父级下面
      father[childrenKey] = branchArr;
    }
    // 只过滤出父级元素
    return father[parentIdKey] === topCode || !father[parentIdKey];
  });
  return tree;
}

/**
 * 根据指定key从主树获取子树，浅拷贝
 * @param {treeObj} tree obj类型
 * @param {string} key 可以是key.key类型
 * @param {any} value 值
 * @param {string} childrenKey children属性key，默认为children
 * @returns {treeObj} 树形对象
 */
export const findSingle = (tree: any, key: string, value: any, childrenKey?: string) => {
  if (!tree) {
    return null;
  }
  let myItem;
  const _childrenKey = childrenKey || 'children';
  const loop = (_tree: any) => {
    const _children = _tree[_childrenKey];
    if (getChainKeysValue(_tree, key) !== value) {
      if (_children && _children.length) {
        _children.forEach((item: any) => {
          loop(item);
        });
      }
    } else {
      myItem = _tree;
    }
  };

  loop(tree);
  return myItem;
};

/**
 * 根据key从主树list获取子树
 * @param {string} key key
 * @param {tree[]} treeList list类型
 * @param {any} value 值
 * @param {string} childrenKey children属性key，默认为children
 * @returns {treeObj} 树形对象
 */
export const getMyTreeListByKey = (treeList: any[], key: string, value: any, childrenKey?: string) => {
  if (!treeList || !treeList.length) {
    return null;
  }
  const _childrenKey = childrenKey || 'children';
  let myTreeObj = null;

  const getTreeList = (_list: any[]) => {
    _list.forEach((item) => {
      const _children = item[_childrenKey];
      if (item[key] === value) {
        myTreeObj = item;
      } else if (_children && _children.length) {
        getTreeList(_children);
      }
    })
  }
  getTreeList(treeList);
  return myTreeObj;
}

/**
 * 获取某个key的集合
 * 例子：
 *  通常用于获取树形结构下所有id的集合
 * @param {tree[]} treeList 源树形数组
 * @param {string} key 可以是key.key类型
 * @param {string} childrenKey children属性key，默认为children
 * @returns {any[]} key值数组
 */
export const getAllTreeKeys = (treeList: any[], key: string, childrenKey?: string): any[] => {
  if (!treeList || !treeList.length) {
    return [];
  }
  const _childrenKey = childrenKey || 'children';
  return treeList.reduce((arr: any[], item) => {
    const _children = item[_childrenKey];
    return arr.concat(getChainKeysValue(item, key), 
      _children && _children.length ? getAllTreeKeys(_children, key, _childrenKey) : []
      )
  }, [])
}

/**
 * 根据key从主树获取子树的所有key值列表
 * 例子：
 *  通常用于获取某个子树下节点的所有id
 * @param {string} key 选用字段key
 * @param {tree[]} treeList 源树形数组
 * @param {any} value 值
 * @param {string} childrenKey children属性key，默认为children
 * @returns {string[]} key值数组
 */
export const getTreeKeysByKey = (treeList: any[], key: string, value: any, childrenKey?: string) => {
  if (!treeList || !treeList.length) {
    return [];
  }
  const _childrenKey = childrenKey || 'children';
  let myTreeObj = getMyTreeListByKey(treeList, key, value, _childrenKey);
  if (!myTreeObj) {
    return [];
  }
  let treeKeys: any[] = [];
  const getTreeKeys = (_treeList: any[]) => {
    _treeList.forEach((item) => {
      const _children = item[_childrenKey];
      treeKeys.push(item[key]);
      if (_children && _children.length) {
        getTreeKeys(_children);
      }
    });
  }
  getTreeKeys([myTreeObj]);
  return treeKeys;
}

/**
 * 扁平化树形
 * @param {tree[]} list tree数组
 * @param {string} childrenKey children属性key，默认为children
 * @returns {any[]} 返回扁平化数组
 */
export function getPeerList(list: any[], childrenKey?: string) {
  if (!list || !list.length) {
    return [];
  }
  const _childrenKey = childrenKey || 'children';
  const peerList: any = [];
  const loopFunc = (_list: any) => {
    for (let i = 0; i < _list.length; i++) {
      const item = _list[i];
      peerList.push(item);
      if (item[_childrenKey] && item[_childrenKey].length) {
        loopFunc(item[_childrenKey]);
      }
    }
  };
  loopFunc(list);
  return peerList;
}

/**
 * 根据字符串模糊筛选tree，底下有的会保存上面和下面的链
 * 例子：
 *  通常用于名字模糊搜索
 * @param {tree[]} origin 原始tree
 * @param {string} key 字符串对比的key
 * @param {any} value 筛选字符串
 * @param {string} childrenKey children属性key，默认为children
 * @returns {tree[]} 树形数组，保存上链和下链
 */
export const filterTreeData = (
  origin: any[],
  key: string,
  value: any,
  childrenKey?: string,
): any[] => {
  if (!origin || !origin.length) {
    return [];
  }
  const resData = [];
  const _childrenKey = childrenKey || 'children';
  // 其实是对子集的筛选
  for (const item of origin) {
    if (typeof item[key] === 'string' && item[key].indexOf(value) > -1) {
      // 如果value包含，则加入
      resData.push(item);
    } else {
      const _children = item[_childrenKey];
      // 获取所有符合的子集
      if (_children && _children.length) {
        const childData = filterTreeData(_children, key, value, _childrenKey);
        if (childData && childData.length) {
          // 有符合的子集，就加入当前的item，形成链
          resData.push({
            ...item,
            [_childrenKey]: childData,
          });
        }
      }
    }
  }
  return resData;
};

/**
 * 根据key筛选tree得到扁平化数组，仅匹配到一个，底下有的会保存上链，去除底部（精准匹配）
 * 例子：
 *  主要用于获取匹配id节点的上链（扁平化）
 *  用于树形名称的链式回显 杭州市/西湖区/xx苑
 * @param {tree[]} origin 原始tree
 * @param {string} key 对比的key
 * @param {any} value 筛选值
 * @param {string} childrenKey children属性key，默认为children
 * @returns {any[]} 扁平化的列表，保存上链
 */
export const filterLine = (origin: any[], key: string, value: any, childrenKey?: string): any[] => {
  if (!origin || !origin.length) {
    return [];
  }
  const _childrenKey = childrenKey || 'children';
  const getLineTree = (origin: any[], key: string, value: any): any[] => {
    const resData = [];
    for (const item of origin) {
      if (item[key] == value) {
        // 本身就是，匹配到之后不要底下的
        const _item = { ...item, [_childrenKey]: undefined };
        resData.push(_item);
      } else {
        const _children = item[_childrenKey] || [];
        if (_children && _children.length) {
          const childData = getLineTree(_children, key, value);
          if (childData && childData.length) {
            // 底下有的
            resData.push({
              ...item,
              [_childrenKey]: childData,
            });
          }
        }
      }
    }
    return resData;
  };
  let lineTree: any = getLineTree(origin, key, value);
  const lineList = [];
  while (lineTree && lineTree.length) {
    lineList.push(lineTree[0]);
    lineTree = lineTree[0][_childrenKey];
  }
  return lineList;
};

/**
 * 获取tree的叶子节点列表
 * 例子：
 *  使用antd树结构时，只拿叶子节点进行回显
 * @param {tree[]} treeL 原始treeList
 * @param {string} childrenKey children属性key，默认为children
 * @returns {any[]} 扁平的叶子节点数组
 */
export const getLeafs = (treeL: any[], childrenKey?: string) => {
  if (!treeL || !treeL.length) {
    return [];
  }
  const leafs: any[] = [];
  const loop = (list: any[]) => {
    list?.forEach((item) => {
      const _children = item[childrenKey || 'children'];
      if (_children && _children.length) {
        loop(_children);
      } else {
        leafs.push(item);
      }
    });
  }
  loop(treeL);
  return leafs;
}