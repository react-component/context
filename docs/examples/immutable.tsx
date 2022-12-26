import {
  createContext,
  makeImmutable,
  responseImmutable,
  useContextSelector,
} from '@rc-component/context';
import React from 'react';
import useRenderTimes from './useRenderTimes';

const AppContext = createContext<{
  appCnt: number;
  appUpdateCnt: number;
}>();

const MyApp = ({ rootCnt, children }: { rootCnt: number; children?: React.ReactNode }) => {
  const [appCnt, setAppCnt] = React.useState(0);
  const [appUpdateCnt, setAppUpdateCnt] = React.useState(0);
  const renderTimes = useRenderTimes();

  return (
    <AppContext.Provider value={{ appCnt, appUpdateCnt }}>
      <button type="button" onClick={() => setAppCnt(v => v + 1)}>
        App CNT: {appCnt}
      </button>
      <button type="button" onClick={() => setAppUpdateCnt(v => v + 1)}>
        App Need Component Update CNT: {appUpdateCnt}
      </button>
      App Render Times: {renderTimes} / Root CNT: {rootCnt}
      <div style={{ border: '1px solid blue', padding: 16 }}>{children}</div>
    </AppContext.Provider>
  );
};
const ImmutableMyApp = makeImmutable(MyApp);

const MyComponent = ({ name }: { name: any }) => {
  const renderTimes = useRenderTimes();
  const value = useContextSelector(AppContext, name);

  return (
    <div>
      {name}: {value} / Component Render Times: {renderTimes}
    </div>
  );
};
const ImmutableMyComponent = responseImmutable(MyComponent);

export default () => {
  const [rootCnt, setRootCnt] = React.useState(0);
  const renderTimes = useRenderTimes();

  return (
    <>
      {' '}
      <button type="button" onClick={() => setRootCnt(v => v + 1)}>
        Root CNT: {rootCnt}
      </button>
      Root RenderTimes: {renderTimes}{' '}
      <div style={{ border: '1px solid red', padding: 16 }}>
        <ImmutableMyApp rootCnt={rootCnt}>
          <ImmutableMyComponent name="appUpdateCnt" />
          <ImmutableMyComponent name="notConsumeAppContext" />
        </ImmutableMyApp>
      </div>
    </>
  );
};
