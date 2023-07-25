# 前端通用树形操作方法
树形操作通常为前端复杂点，为了不重复造轮子，便于各种框架和项目的树形操作，故写了这个库。

## 使用范围
通用

## 使用方式
npm i @szsk/tree-utils

import { treeUtils } from '@szsk/tree-utils';

ts使用
```
  // tsconfig.json
  "compilerOptions": {
    "typeRoots": [
      // 加入这个进行自动提示
      "node_modules/@szsk",
    ]
  },
```

### tree
```
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
export const changeTreePropName = (list: any[], changeKeys: Array<[string, string, Function?]>, childrenKey?: string)

/**
 * 把线性数据转成树形数据
 * @param {any[]} source 原数据List
 * @param {string} idKey id的key
 * @param {string} parentIdKey parentId的key 
 * @param {string} childrenKey children的key
 * @param {string} topCode 顶级元素父元素的id
 * @returns {tree[]} 树形数组
 */
export function setTreeData(source: any[], idKey: string, parentIdKey: string, childrenKey: string, topCode?: string)

/**
 * 获取某个key的集合
 * 例子：
 *  通常用于获取树形结构下所有id的集合
 * @param {tree[]} treeList 源树形数组
 * @param {string} key 可以是key.key类型
 * @param {string} childrenKey children属性key，默认为children
 * @returns {any[]} key值数组
 */
export const getAllTreeKeys = (treeList: any[], key: string, childrenKey?: string)

/**
 * 根据指定key从主树获取子树，浅拷贝
 * @param {treeObj} tree obj类型
 * @param {string} key 可以是key.key类型
 * @param {any} value 值
 * @param {string} childrenKey children属性key，默认为children
 * @returns {treeObj} 树形对象
 */
export const findSingle = (tree: any, key: string, value: any, childrenKey?: string)

/**
 * 根据key从主树list获取子树
 * @param {string} key key
 * @param {tree[]} treeList list类型
 * @param {string} value 值
 * @param {string} childrenKey children属性key，默认为children
 * @returns {treeObj} 树形对象
 */
export const getMyTreeListById = (key: string, treeList: any[], value: string, childrenKey?: string)

/**
 * 根据key从主树获取子树的所有key值列表
 * 例子：
 *  通常用于获取某个子树下节点的所有id
 * @param {string} key 选用字段key
 * @param {tree[]} treeList 源树形数组
 * @param {string} value 值
 * @param {string} childrenKey children属性key，默认为children
 * @returns {string[]} key值数组
 */
export const getTreeIdsById = (key: string, treeList: any[], value: string, childrenKey?: string)

/**
 * 扁平化树形
 * @param {tree[]} list tree数组
 * @param {string} childrenKey children属性key，默认为children
 * @returns {any[]} 返回扁平化数组
 */
export function getPeerList(list: any[], childrenKey?: string)

/**
 * 根据字符串筛选tree，底下有的会保存上面和下面的链
 * 例子：
 *  通常用于名字搜索
 * @param {tree[]} origin 原始tree，子集为children
 * @param {string} value 筛选字符串
 * @param {string} key 字符串对比的key
 * @param {string} childrenKey children属性key，默认为children
 * @returns {tree[]} 树形数组，保存上链和下链
 */
export const filterTreeData = (
  origin: any[],
  value: string,
  key: string,
  childrenKey?: string,
)

/**
 * 根据key筛选tree，仅匹配到一个，底下有的会保存上链，去除底部
 * 例子：
 *  主要用于获取匹配id节点的上链（扁平化）
 * @param {tree[]} origin 原始tree，子集为children
 * @param {string} value 筛选值
 * @param {string} key 对比的key
 * @param {string} childrenKey children属性key，默认为children
 * @returns {any[]} 扁平化的列表，保存上链
 */
export const filterLine = (origin: any[], value: string, key: string, childrenKey?: string)

/**
 * 获取tree的叶子节点列表
 * 例子：
 *  使用antd树结构时，只拿叶子节点进行回显
 * @param {tree[]} treeL 原始treeList
 * @param {string} childrenKey children属性key，默认为children
 * @returns {any[]} 扁平的叶子节点数组
 */
export const getLeafs = (treeL: any[], childrenKey?: string)
```
