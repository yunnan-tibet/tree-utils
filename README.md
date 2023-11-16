# 前端通用树形操作方法
树形操作通常为前端复杂点，为了不重复造轮子，便于各种框架和项目的树形操作，故写了这个库。

## 使用范围
通用

## 方法例子
### changeTreePropName
##### 后端返回的字段可能和前端需要不符的情况下，用来改变树形结构的key
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
          }
        ]
      }
    ]
  }
]

// 例子1，改变属性名
const _treeL = changeTreePropName(treeList, [['deptId', 'value'], ['deptName', 'label'], ['deptChildrenList', 'children']], 'deptChildrenList');
// _treeL会得到下面的结果
[
  {
    value: '1',
    label: 'dept1',
    children: [
      {
        value: '2',
        label: 'dept2',
        children: [
          {
            value: '3',
            label: 'dept3',
          }
        ]
      }
    ]
  }
]

// 例子2，使用方法改变属性名（源属性名可以多次使用）
const _treeL1 = changeTreePropName(treeList, [['deptId', 'value'], ['deptName', 'label'], ['deptChildrenList', 'children'], ['deptChildrenList', 'isLeaf', (v) => {
  return !v || !v.length
}]], 'deptChildrenList');

// _treeL1会得到下面的结果
[
  {
    value: '1',
    label: 'dept1',
    isLeaf: false,
    children: [
      {
        value: '2',
        label: 'dept2',
        isLeaf: false,
        children: [
          {
            value: '3',
            label: 'dept3',
            isLeaf: true,
          }
        ]
      }
    ]
  }
]
```

### setTreeData
##### 把线性数据转成树形数据
```
// 例子
const peerList = [
  {
    deptId: '1',
    deptName: 'name1',
    parentId: null,
  },
  {
    deptId: '2',
    deptName: 'name2',
    parentId: '1',
  },
  {
    deptId: '3',
    deptName: 'name3',
    parentId: '2',
  },
  {
    deptId: '4',
    deptName: 'name4',
    parentId: null,
  }
]

// 当前例子parentId为null，若顶级parentId存在，则设置topCode即可
const _treeL = setTreeData(peerList, 'deptId', 'parentId', 'children')

// _treeL会得到下面的结果
[
  {
    deptId: '1',
    deptName: 'name1',
    parentId: null,
    children: [
      {
        deptId: '2',
        deptName: 'name2',
        parentId: '1',
        children: [
          {
            deptId: '3',
            deptName: 'name3',
            parentId: '2',
          }
        ],
      }
    ],
  },
  {
    deptId: '4',
    deptName: 'name4'
    parentId: null,
  }
]
```

### getAllTreeKeys
##### 获取某个key的集合
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    info: {
      innerId: '11',
    },
    deptChildrenList: [
      {
        deptId: '2',
        info: {
          innerId: '21',
        },
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
            info: {
              innerId: '31',
            },
          }
        ]
      }
    ]
  }
]

// 例子1
const _keys = getAllTreeKeys(treeList, 'deptId', 'deptChildrenList')

// _keys会得到下面的结果
['1', '2', '3']

// 例子2，多层级属性key获取
const _keys1 = getAllTreeKeys(treeList, 'info.innerId', 'deptChildrenList')

// _keys1会得到下面的结果
['11', '21', '31']
```
### findSingle
##### 根据指定key从主树获取子树，浅拷贝
```
// 以最常见的部门树结构来举例
const treeObj = {
  deptId: '1',
  deptName: 'dept1',
  info: {
    innerId: '11',
  },
  deptChildrenList: [
    {
      deptId: '2',
      info: {
        innerId: '21',
      },
      deptName: 'dept2',
      deptChildrenList: [
        {
          deptId: '3',
          deptName: 'dept3',
          info: {
            innerId: '31',
          },
        }
      ]
    }
  ]
}

// 例子1
const _treeObj = findSingle(treeObj, 'deptId', '2', 'deptChildrenList')

// _treeObj会得到下面的结果
{
  deptId: '2',
  info: {
    innerId: '21',
  },
  deptName: 'dept2',
  deptChildrenList: [
    {
      deptId: '3',
      deptName: 'dept3',
      info: {
        innerId: '31',
      },
    }
  ]
}

// 例子2
const _treeObj1 = findSingle(treeObj, 'info.innerId', '31', 'deptChildrenList')

// _treeObj1会得到下面的结果

{
  deptId: '3',
  deptName: 'dept3',
  info: {
    innerId: '31',
  },
}

```
### getMyTreeListByKey
##### 根据key从主树list获取子树
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
          }
        ]
      }
    ]
  }
]

// 例子
const _treeObj = getMyTreeListByKey(treeList, 'deptId', '2', 'deptChildrenList')

// _treeObj会得到下面的结果
{
  deptId: '2',
  deptName: 'dept2',
  deptChildrenList: [
    {
      deptId: '3',
      deptName: 'dept3',
    }
  ]
}

```
### getTreeKeysByKey
##### 根据key从主树获取子树的所有key值列表
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
          }
        ]
      }
    ]
  }
]

// 例子
const _keys = getTreeKeysByKey(treeList, 'deptId', '2', 'deptChildrenList')

// _keys会得到下面的结果
['2', '3']

```
### getPeerList
##### 扁平化树形
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
          }
        ]
      }
    ]
  }
]

// 例子
const _peerL = getPeerList(treeList, 'deptChildrenList')

// _peerL会得到下面的结果
[
  {
    deptId: '1',
    deptName: 'dept1',
  },
  {
    deptId: '2',
    deptName: 'dept2',
  },
  {
    deptId: '3',
    deptName: 'dept3',
  },
]

```
### filterTreeData
##### 根据字符串模糊筛选tree，底下有的会保存上面和下面的链，支持多个模糊搜索
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
          }
        ]
      },
      {
        deptId: '4',
        deptName: 'dept4',
        deptChildrenList: [
          {
            deptId: '5',
            deptName: 'dept5',
          }
        ]
      },
    ]
  },
]

// 例子
const _treeL = filterTreeData(treeList, 'deptName', 'pt4', 'deptChildrenList')

// _treeL会得到下面的结果，dept4匹配到了pt4
[
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '4',
        deptName: 'dept4',
        deptChildrenList: [
          {
            deptId: '5',
            deptName: 'dept5',
          }
        ]
      },
    ]
  },
]
```
### filterTreeDataExact
##### 精准筛选tree，底下有的会保存上面和下面的链
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '34',
            deptName: 'dept3',
          }
        ]
      },
      {
        deptId: '4',
        deptName: 'c',
        deptChildrenList: [
          {
            deptId: '5',
            deptName: 'dept5',
          }
        ]
      },
    ]
  },
]

// 例子
const _treeL = filterTreeData(treeList, 'deptId', '4', 'deptChildrenList')

// _treeL会得到下面的结果，匹配到了deptId为4，不会匹配到34
[
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '4',
        deptName: 'dept4',
        deptChildrenList: [
          {
            deptId: '5',
            deptName: 'dept5',
          }
        ]
      },
    ]
  },
]
```
### filterLine
##### 根据key筛选tree得到扁平化数组，仅匹配到一个，底下有的会保存上链，去除底部
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
          }
        ]
      }
    ]
  },
  {
    deptId: '4',
    deptName: 'dept4',
  }
]

// 例子
const _peerL = filterLine(treeList, 'deptId', '2', 'deptChildrenList')

// _peerL会得到下面的结果
[
  {
    deptId: '1',
    deptName: 'dept1',
  },
  {
    deptId: '2',
    deptName: 'dept2',
  },
]
```
### getLeafs
##### 获取tree的叶子节点列表
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
          }
        ]
      }
    ]
  },
  {
    deptId: '4',
    deptName: 'dept4',
  }
]

// 例子
const _leafL = getLeafs(treeList, 'deptChildrenList')

// _leafL会得到下面的结果
[
  {
    deptId: '3',
    deptName: 'dept3',
  },
  {
    deptId: '4',
    deptName: 'dept4',
  }
]
```

### mergeTreeList
##### 将两个树形列表进行合并，合并数组默认是同层级的合并
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '11',
        deptName: 'dept11',
        deptChildrenList: [
          {
            deptId: '111',
            deptName: 'dept111',
          },
          {
            deptId: '112',
            deptName: 'dept112',
          }
        ]
      }
    ]
  },
]

const addTreeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '11',
        deptName: 'dept11',
        deptChildrenList: [
          {
            deptId: '113',
            deptName: 'dept113',
          }
        ]
      }
    ]
  },
  {
    deptId: '2',
    deptName: 'dept2',
  }
]

// 例子
const mergedTreeL = mergeTreeList(treeList, addTreeList, 'deptId', 'deptChildrenList')

// mergedTreeL会得到下面的结果
[
  {
    deptId: '1',
    deptName: 'dept1',
    deptChildrenList: [
      {
        deptId: '11',
        deptName: 'dept11',
        deptChildrenList: [
          {
            deptId: '111',
            deptName: 'dept111',
          },
          {
            deptId: '112',
            deptName: 'dept112',
          }
          {
            deptId: '113',
            deptName: 'dept113',
          }
        ]
      }
    ]
  },
  {
    deptId: '2',
    deptName: 'dept2',
  }
]
```

### filterTopMenu
##### 根据key在主树截断不符合的子元素
```
// 以最常见的部门树结构来举例
const treeList = [
  {
    deptId: '1',
    deptName: 'dept1',
    type: 'menu',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        type: 'menu',
        deptChildrenList: [
          {
            deptId: '3',
            deptName: 'dept3',
            type: 'button',
          }
        ]
      }
    ]
  },
  {
    deptId: '4',
    deptName: 'dept4',
    type: 'menu',
  }
]

// 例子
const _l = filterTopMenu(treeList, 'type', 'menu', 'deptChildrenList')

// _l会得到下面的结果
[
  {
    deptId: '1',
    deptName: 'dept1',
    type: 'menu',
    deptChildrenList: [
      {
        deptId: '2',
        deptName: 'dept2',
        type: 'menu',
        deptChildrenList: []
      }
    ]
  },
  {
    deptId: '4',
    deptName: 'dept4',
    type: 'menu',
  }
]
```

方法 | 参数 | 参数说明 | 说明
------ | ------ | ------ | ------
changeTreePropName | (list: any[], changeKeys: Array<[string, string, Function?]>, childrenKey?: string) | @param {tree[]} list 树形列表, @param {Array<[string, string, Function?]>} changeKeys Array<[原始key, 最终key, changeFunc(item[原始key], item)]>, @param {string} childrenKey children属性key，默认为children, @returns {tree[]} 树形数组 | 后端返回的字段可能和前端需要不符的情况下，用来改变树形结构的key，例子：1.统一树形数据字段，2.主动适配组件
setTreeData | (source: any[], idKey: string, parentIdKey: string, childrenKey: string, topCode?: string) | @param {any[]} source 原数据List, @param {string} idKey id的key, @param {string} parentIdKey parentId的key, {string} childrenKey 生成children的key, @param {string} topCode 顶级元素父元素的id, @returns {tree[]} 树形数组 | 把线性数据转成树形数据
findSingle | (tree: any, key: string, value: any, childrenKey?: string) | @param {treeObj} tree obj类型, @param {string} key 可以是key.key类型, @param {any} value 值, @param {string} childrenKey children属性key，默认为children, @returns {treeObj} 树形对象 | 根据指定key从主树获取子树，浅拷贝
getMyTreeListByKey | (treeList: any[], key: string, value: any, childrenKey?: string) | @param {string} key key, @param {tree[]} treeList list类型, @param {any} value 值, @param {string} childrenKey children属性key，默认为children, @returns {treeObj} 树形对象 | 根据key从主树list获取子树
getAllTreeKeys | (treeList: any[], key: string, childrenKey?: string) | @param {tree[]} treeList 源树形数组, @param {string} key 可以是key.key类型, @param {string} childrenKey children属性key，默认为children, @returns {any[]} key值数组 | 获取某个key的集合, 例子：通常用于获取树形结构下所有id的集合
getTreeKeysByKey | (treeList: any[], key: string, value: any, childrenKey?: string) | @param {string} key 选用字段key, @param {tree[]} treeList 源树形数组, @param {any} value 值, @param {string} childrenKey children属性key，默认为children, @returns {string[]} key值数组 | 根据key从主树获取子树的所有key值列表
getPeerList | (list: any[], childrenKey?: string) | @param {tree[]} list tree数组，@param {string} childrenKey children属性key，默认为children，@returns {any[]} 返回扁平化数组 | 扁平化树形
filterTreeData | (origin: any[], key: string | string[], value: any, childrenKey?: string) | @param {tree[]} origin 原始tree, @param {any} value 筛选字符串, @param {string} key 字符串对比的key，支持多个, @param {string} childrenKey children属性key，默认为children, @returns {tree[]} 树形数组，保存上链和下链 | 根据字符串模糊筛选tree，底下有的会保存上面和下面的链，支持多个模糊搜索，例子：通常用于名字模糊搜索
filterTreeDataExact | (origin: any[], key: string | string[], value: any, childrenKey?: string) | @param {tree[]} origin 原始tree, @param {any} value 筛选字符串, @param {string} key 字符串对比的key，支持多个, @param {string} childrenKey children属性key，默认为children, @returns {tree[]} 树形数组，保存上链和下链 | 精准筛选tree，底下有的会保存上面和下面的链，例子：获取单独整条链
filterLine | (origin: any[], key: string, value: any, childrenKey?: string) | @param {tree[]} origin 原始tree, @param {any} value 筛选值, @param {string} key 对比的key, @param {string} childrenKey children属性key，默认为children, @returns {any[]} 扁平化的列表，保存上链 | 根据key筛选tree得到扁平化数组，仅匹配到一个，底下有的会保存上链，去除底部（精准匹配）, 例子：1.主要用于获取匹配id节点的上链（扁平化）2.用于树形名称的链式回显 杭州市/西湖区/xx苑
getLeafs | (treeL: any[], childrenKey?: string) | @param {tree[]} treeL 原始treeList, @param {string} childrenKey children属性key，默认为children, @returns {any[]} 扁平的叶子节点数组 | 获取tree的叶子节点列表, 例子：使用antd树结构时，只拿叶子节点进行回显
mergeTreeList | (treeList: any[], addTreeList: any[], key: string, childenKey?: string) | @param {tree[]} treeList 源树形数组，@param {tree[]} addTreeList 加入的树形数组，@param {string} key 对比的key，@param {string} childenKey children属性key，默认为children，@returns {tree[]} 合并后的树形数组 | 将两个树形列表进行合并，合并数组默认是同层级的合并
filterTopMenu | (treeList: any[], key: string, value: any, childenKey?: string) | @param {tree[]} treeList 源树形数组，@param {string} key 对比的key，@param {any} value 值，@param {string} childenKey children属性key，默认为children，@returns {tree[]} 筛选后的树形数组 | 根据key在主树截断不符合的子元素