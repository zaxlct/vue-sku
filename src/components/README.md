## specification
```javascript
[
  {
    id: 1,
    value: '颜色',
    leaf: [
      {
        id: 11,
        value: '白色',
      },
      {
        id: 12,
        value: '黑色',
      },
      {
        id: 13,
        value: '金色',
      },
    ],
  },
  {
    id: 2,
    value: '内存',
    leaf: [
      {
        id: 21,
        value: '128G',
      },
      {
        id: 22,
        value: '256G',
      },
      {
        id: 23,
        value: '512G',
      },
    ],
  },
  {
    id: 3,
    value: '运营商',
    leaf: [
      {
        id: 31,
        value: '移动',
      },
      {
        id: 32,
        value: '联通',
      },
      {
        id: 33,
        value: '电信',
      },
      {
        id: 34,
        value: '全网通',
      },
    ],
  },
]
```

## Flatten
#### SKU.flatten(sku, items, options)
通过计算笛卡尔积，将树形的value变成扁平的数组

| 参数 | 说明 | 类型 | 默认值 | 备选值 |
|------|------|------|--------|--------|
| sku | 当前选中规格的value | array | `[]` |  |
| items | 当前已存在的数据 | array | `[]` |  |
| options | 可配置参数 | object | `{}` | `optionValue: 'id', optionText: 'value'` |

```javascript
import { SKU } from 'zent'

const { flatten } = SKU

let skus = [
  { id: 1, value: '颜色', leaf: [{id: 11, value: '红色'}, {id: 12, value: '蓝色'}] },
  { id: 2, value: '尺寸', leaf: [{id: 21, value: '大'}, {id: 22, value: '小'}] }
]

console.log(flatten(skus))
/**
 * output:
 * [
 *   {"skus":[{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":21,"v":"大"}]},
 *   {"skus":[{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}]}
 *   {"skus":[{"k_id":1,"k":"颜色","v_id":12,"v":"蓝色"},{"k_id":2,"k":"尺寸","v_id":21,"v":"大"}]}
 *   {"skus":[{"k_id":1,"k":"颜色","v_id":12,"v":"蓝色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}]}
 * ]
 */

// 为某个 SKU 添加额外字段，例如标价、成本、工厂指导价等
let items = [
  {
    "price": "10.00",
    "code": "AE86",
    "skus":[{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}]
  }
]
console.log(flatten(skus, items))

/**
 * output:
 * [
 *   {"skus":[{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":21,"v":"大"}]},
 *   {
 *    "price":"10.00",
 *    "code":"AE86",
 *    "skus":[{"k_id":1,"k":"颜色","v_id":11,"v":"红色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}]
 *   },
 *   {"skus":[{"k_id":1,"k":"颜色","v_id":12,"v":"蓝色"},{"k_id":2,"k":"尺寸","v_id":21,"v":"大"}]}
 *   {"skus":[{"k_id":1,"k":"颜色","v_id":12,"v":"蓝色"},{"k_id":2,"k":"尺寸","v_id":22,"v":"小"}]}
 * ]
 */
```

## isSame
```javascript
import { SKU } from 'zent'

const { isSame } = SKU

let skuA = [
  { id: 1, value: '颜色', leaf: [{id: 11, value: '红色'}, {id: 12, value: '蓝色'}] },
  { id: 2, value: '尺寸', leaf: [{id: 21, value: '大'}, {id: 22, value: '小'}] }
]

let skuB = [
  { id: 1, value: '颜色', leaf: [{id: 11, value: '红色'}, {id: 12, value: '蓝色'}] },
  { id: 2, value: '尺寸', leaf: [{id: 21, value: '大'}, {id: 22, value: '小'}] }
]

let skuC = [
  { id: 1, value: '颜色', leaf: [{id: 11, value: '红色'}, {id: 12, value: '蓝色'}] },
  { id: 2, value: '尺寸', leaf: [{id: 22, value: '小'}, {id: 21, value: '大'}] }
]

let skuD = [
  { id: 1, value: '颜色', leaf: [{id: 11, value: '红色'}, {id: 12, value: '蓝色'}] },
  { id: 3, value: '尺寸', leaf: [{id: 21, value: '大'}, {id: 22, value: '小'}] }
]

console.log(isSame(skuA, skuB))
console.log(isSame(skuA, skuC))
console.log(isSame(skuA, skuD))

/**
 * output:
 *
 * true
 * false
 * false
 */
```

## Flatten、isSame 如何在 Python 里使用
1. 打开[源代码](https://gitee.com/zaxlct/number-squares/blob/dev/src/utils/sku/index.js)
2. 源代码有三个函数 `getLevels flatten isEqual`，依次复制三个函数到 [ES6 转 ES5 网站](https://www.babeljs.cn/repl)（相当于 python3 转 python2）
3. 注意，每个函数前的 `export` 语句要删除。即 `export function` => `function`
4. 使用 [Jiphy](https://github.com/timothycrosley/jiphy) 把生成的 ES5 JS 代码转为 python
