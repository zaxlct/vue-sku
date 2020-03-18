# vue-sku

- 用 element-ui 实现了 zent 的 SKU 规格选择器组件
- 后台编辑 SKU
- 为每一种 SKU 设置额外的属性，如价格、库存等
- 前端展示并选择 SKU

## 2019-11-03 更新内容

- **[async 分支](https://github.com/zaxlct/vue-sku/tree/async)，实现了从模拟请求后端 mock 数据，到获取当前的 sku 参数传递给后端的完整 demo**
- 删除了合并单元格功能

## [在线 DEMO](https://zaxlct.github.io/vue-sku/)（master 分支）

注意：本项目只提供 DEMO 提供参考，并未打包成 npm package
![DEMO](http://furniture-resource.sutot.cn/Jietu20190702-215359@2x.jpg)

## 参考实现

- [zent-sku](https://github.com/zent-contrib/sku)
- [rossroma/vue-sku](https://github.com/rossroma/vue-sku)

## 文档

> Flatten、isSame 直接引用了 zent sku [官方文档](https://youzan.github.io/zent/zh/component/sku)

#### Flatten

`SKU.flatten(sku, items, options)`
通过计算笛卡尔积，将树形的 value 变成扁平的数组

| 参数    | 说明                 | 类型   | 默认值 | 备选值                                   |
| ------- | -------------------- | ------ | ------ | ---------------------------------------- |
| sku     | 当前选中规格的 value | array  | `[]`   |                                          |
| items   | 当前已存在的数据     | array  | `[]`   |                                          |
| options | 可配置参数           | object | `{}`   | `optionValue: 'id', optionText: 'value'` |

```javascript
import { flatten } from "src/utils/sku";

let skus = [
  {
    id: 1,
    value: "颜色",
    leaf: [{ id: 11, value: "红色" }, { id: 12, value: "蓝色" }]
  },
  {
    id: 2,
    value: "尺寸",
    leaf: [{ id: 21, value: "大" }, { id: 22, value: "小" }]
  }
];

console.log(flatten(skus));
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
    price: "10.00",
    code: "AE86",
    skus: [
      { k_id: 1, k: "颜色", v_id: 11, v: "红色" },
      { k_id: 2, k: "尺寸", v_id: 22, v: "小" }
    ]
  }
];
console.log(flatten(skus, items));

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

#### isSame

```javascript
import { isSame } from "src/utils/sku";

let skuA = [
  {
    id: 1,
    value: "颜色",
    leaf: [{ id: 11, value: "红色" }, { id: 12, value: "蓝色" }]
  },
  {
    id: 2,
    value: "尺寸",
    leaf: [{ id: 21, value: "大" }, { id: 22, value: "小" }]
  }
];

let skuB = [
  {
    id: 1,
    value: "颜色",
    leaf: [{ id: 11, value: "红色" }, { id: 12, value: "蓝色" }]
  },
  {
    id: 2,
    value: "尺寸",
    leaf: [{ id: 21, value: "大" }, { id: 22, value: "小" }]
  }
];

let skuC = [
  {
    id: 1,
    value: "颜色",
    leaf: [{ id: 11, value: "红色" }, { id: 12, value: "蓝色" }]
  },
  {
    id: 2,
    value: "尺寸",
    leaf: [{ id: 22, value: "小" }, { id: 21, value: "大" }]
  }
];

let skuD = [
  {
    id: 1,
    value: "颜色",
    leaf: [{ id: 11, value: "红色" }, { id: 12, value: "蓝色" }]
  },
  {
    id: 3,
    value: "尺寸",
    leaf: [{ id: 21, value: "大" }, { id: 22, value: "小" }]
  }
];

console.log(isSame(skuA, skuB));
console.log(isSame(skuA, skuC));
console.log(isSame(skuA, skuD));

/**
 * output:
 *
 * true
 * false
 * false
 */
```

#### Flatten、isSame 函数如何在 Python 里使用

1. 打开[源代码](https://gitee.com/zaxlct/number-squares/blob/dev/src/utils/sku/index.js)
2. 源代码有三个函数 `getLevels flatten isEqual`，依次复制三个函数到 [ES6 转 ES5 网站](https://www.babeljs.cn/repl)（相当于 python3 转 python2）
3. 注意，每个函数前的 `export` 语句要删除。即 `export function` => `function`
4. 使用 [Jiphy](https://github.com/timothycrosley/jiphy) 把生成的 ES5 JS 代码转为 python

## 感谢第三方库

- [element-ui](https://github.com/ElemeFE/element)
- [zent](https://github.com/youzan/zent)
- [egrid](https://github.com/kinglisky/egrid)
- [vue-json-pretty](https://github.com/leezng/vue-json-pretty)

## 本地预览项目

```bash
git clone https://github.com/zaxlct/vue-sku
npm install
npm run serve
```

## TODO

- 库存为零时，选择 sku 的按钮 disabled

## 提问

- 有问题可发起 issues，或加 QQ 群： 163801325
- 有想法亦可发起 PR
