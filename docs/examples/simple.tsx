import { createContext, useContext } from '@rc-component/context';
import React from 'react';
import useRenderTimes from './useRenderTimes';

const CountContext = createContext<{
  cnt1: number;
  cnt2: number;
}>();

const MyConsumer = React.memo(({ name }: { name: any }) => {
  const value = useContext(CountContext, name);
  const renderTimes = useRenderTimes();

  return (
    <div>
      <label>{JSON.stringify(name)}:</label>
      {value} ({renderTimes} times)
    </div>
  );
});

export default () => {
  const [cnt1, setCnt1] = React.useState(0);
  const [cnt2, setCnt2] = React.useState(0);
  const renderTimes = useRenderTimes();

  return (
    <CountContext.Provider value={{ cnt1, cnt2 }}>
      <button type="button" onClick={() => setCnt1(v => v + 1)}>
        cnt 1: {cnt1}
      </button>
      <button type="button" onClick={() => setCnt2(v => v + 1)}>
        cnt 2: {cnt2}
      </button>
      {renderTimes} times
      <MyConsumer name="cnt1" />
      <MyConsumer name="cnt2" />
    </CountContext.Provider>
  );
};
