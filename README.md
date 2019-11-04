# vue-sku

本分支实现了从请求 mock 数据，到获取当前的 sku 参数传递给后端的完整 demo

## 查看 DEMO

1. 克隆本项目

```
git clone https://github.com/zaxlct/vue-sku
```

2. 切换到 `async` 分支

3. 安装依赖

```
npm i
npm start
```

浏览器打开 `http://localhost:3000/`

## 常见问题

### 1. 后端返回的 sku 数据结构是什么？

可参考 mock 的数据结构
`/src/components/mock.js`

### 2. 后端返回的 sku 数据结构和 mock 的数据结构不一致怎么办？

修改 `/src/components/sku2param.js` 的 `param2Data` 方法。
简单粗暴的解决办法是把后端返回的数据结构转成和 mock 一致，再调用 `param2Data` 即可。

### 3. 如何获取前端提交给后端的 sku 参数

点击「获取 sku 数据」按钮，在 console 控制台可查看
