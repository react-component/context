<div align="center">
  <h1>@rc-component/context</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Ant Design 生态的一部分。</sub></p>
  <p>🔁 面向 rc-component 包的高性能 React Context 选择器工具。</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/context"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/context.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/context"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/context.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/context/actions/workflows/test.yml"><img alt="build status" src="https://github.com/react-component/context/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/context"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/context/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/context"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/context?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center"><a href="./README.md">English</a> | 简体中文</p>

## 亮点

| 方向 | 支持                                                    |
| ---- | ------------------------------------------------------- |
| 定位 | 面向 rc-component 包的高性能 React Context 选择器工具。 |
| 包名 | `@rc-component/context`                                 |
| 发布 | `@rc-component/np` / `rc-np`                            |

## 安装

```bash
npm install @rc-component/context
```

## 用法

```tsx | pure
import createContext from '@rc-component/context';

const [Provider, useContext] = createContext({ count: 0 });

export { Provider, useContext };
```

## API

| 名称                          | 说明                                        |
| ----------------------------- | ------------------------------------------- |
| `createContext(defaultValue)` | 创建 Provider 与支持选择器的 context hook。 |

## 本地开发

```bash
npm install
npm start
npm test
npm run lint
npm run tsc
npm run compile
```

本地 dumi 站点默认运行在 `http://localhost:8000`.

## 发布

```bash
npm run prepublishOnly
```

发布流程通过 `@rc-component/np` 提供的 `rc-np` 命令处理。

## 许可证

@rc-component/context 基于 [MIT](./LICENSE.md) 协议发布。
