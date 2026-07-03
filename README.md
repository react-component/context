<div align="center">
  <h1>@rc-component/context</h1>
  <p><sub><a href="https://ant.design"><img alt="Ant Design" height="14" src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" style="vertical-align: -0.125em;" /></a> Part of the Ant Design ecosystem.</sub></p>
  <p>🔁 Performant React context selector utilities for rc-component packages.</p>

  <p>
    <a href="https://npmjs.org/package/@rc-component/context"><img alt="NPM version" src="https://img.shields.io/npm/v/@rc-component/context.svg?style=flat-square"></a>
    <a href="https://npmjs.org/package/@rc-component/context"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@rc-component/context.svg?style=flat-square"></a>
    <a href="https://github.com/react-component/context/actions/workflows/test.yml"><img alt="build status" src="https://github.com/react-component/context/actions/workflows/test.yml/badge.svg"></a>
    <a href="https://app.codecov.io/gh/react-component/context"><img alt="Codecov" src="https://img.shields.io/codecov/c/github/react-component/context/master.svg?style=flat-square"></a>
    <a href="https://bundlephobia.com/package/@rc-component/context"><img alt="bundle size" src="https://img.shields.io/bundlephobia/minzip/@rc-component/context?style=flat-square"></a>
    <a href="https://github.com/umijs/dumi"><img alt="dumi" src="https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square"></a>
  </p>
</div>

<p align="center">English | <a href="./README.zh-CN.md">简体中文</a></p>

## Highlights

| Area    | Support                                                                |
| ------- | ---------------------------------------------------------------------- |
| Purpose | Performant React context selector utilities for rc-component packages. |
| Package | `@rc-component/context`                                                |
| Release | `@rc-component/np` / `rc-np`                                           |

## Install

```bash
npm install @rc-component/context
```

## Usage

```tsx | pure
import { createContext } from '@rc-component/context';

const [Provider, useContext] = createContext({ count: 0 });

export { Provider, useContext };
```

## API

| API                           | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| `createContext(defaultValue)` | Create a provider and selector-aware context hook. |

## Development

```bash
npm install
npm start
npm test
npm run lint
npm run tsc
npm run compile
```

The dumi site runs at `http://localhost:8000`.

## Release

```bash
npm run prepublishOnly
```

The release flow is handled by `@rc-component/np` through the `rc-np` command when the package uses the shared release flow.

## License

@rc-component/context is released under the [MIT](./LICENSE.md) license.
