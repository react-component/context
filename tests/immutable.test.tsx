import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { createContext, makeImmutable, responseImmutable, useContext } from '../src';
import { RenderTimer, Value } from './common';

describe('Immutable', () => {
  const CountContext = createContext<number>();

  describe('makeImmutable', () => {
    const Root = ({ children }: { children?: React.ReactNode; trigger?: string }) => {
      const [count, setCount] = React.useState(0);
      const [selfState, setSelfState] = React.useState(0);

      return (
        <CountContext.Provider value={count}>
          <button id="count" onClick={() => setCount(v => v + 1)} />
          <button id="self" onClick={() => setSelfState(v => v + 1)} />

          <Value id="count-value" value={count} />
          <Value id="self-value" value={selfState} />

          {children}
        </CountContext.Provider>
      );
    };

    const ImmutableRoot = makeImmutable(Root);

    const Raw = () => {
      return (
        <>
          <Value id="value" value={useContext(CountContext)} />
          <RenderTimer id="raw" />
        </>
      );
    };

    const ImmutableRaw = responseImmutable(Raw);

    it('update by outside', () => {
      const { container, rerender } = render(
        <ImmutableRoot>
          <ImmutableRaw />
        </ImmutableRoot>,
      );

      // Mount
      expect(container.querySelector('#raw')!.textContent).toEqual('1');
      expect(container.querySelector('#value')!.textContent).toEqual('0');

      // Update `count`: Full Update
      fireEvent.click(container.querySelector('#count'));
      expect(container.querySelector('#count-value').textContent).toEqual('1');
      expect(container.querySelector('#self-value').textContent).toEqual('0');

      expect(container.querySelector('#raw')!.textContent).toEqual('2');
      expect(container.querySelector('#value')!.textContent).toEqual('1');

      // Update `selfState`: No Update
      fireEvent.click(container.querySelector('#self'));
      expect(container.querySelector('#count-value').textContent).toEqual('1');
      expect(container.querySelector('#self-value').textContent).toEqual('1');

      expect(container.querySelector('#raw')!.textContent).toEqual('2');
      expect(container.querySelector('#value')!.textContent).toEqual('1');

      // Update Root Props: Full Update
      rerender(
        <ImmutableRoot trigger="yes">
          <ImmutableRaw />
        </ImmutableRoot>,
      );
      expect(container.querySelector('#raw')!.textContent).toEqual('3');
      expect(container.querySelector('#value')!.textContent).toEqual('1');
    });
  });

  it('ref-able', () => {
    const Root = React.forwardRef<HTMLDivElement, { children?: React.ReactNode }>((_, ref) => (
      <div className="root" ref={ref} />
    ));
    const ImmutableRoot = makeImmutable(Root);
    const Raw = React.forwardRef<HTMLDivElement>((_, ref) => <div className="raw" ref={ref} />);
    const ImmutableRaw = responseImmutable(Raw);

    const rootRef = React.createRef<HTMLDivElement>();
    const rawRef = React.createRef<HTMLDivElement>();

    const { container } = render(
      <ImmutableRoot ref={rootRef}>
        <ImmutableRaw ref={rawRef} />
      </ImmutableRoot>,
    );

    expect(rootRef.current).toBe(container.querySelector('.root'));
    expect(rawRef.current).toBe(container.querySelector('.raw'));
  });

  it('customize propsAreEqual', () => {
    const Input: React.FC<{
      value: string;
      onChange: React.ChangeEventHandler<HTMLInputElement>;
    }> = props => (
      <>
        <input {...props} />
        <RenderTimer id="input" />
      </>
    );

    const ImmutableInput = responseImmutable(Input);

    const { container, rerender } = render(<ImmutableInput value="same" onChange={() => {}} />);
    expect(container.querySelector('#input').textContent).toEqual('1');

    rerender(<ImmutableInput value="same" onChange={() => {}} />);
    expect(container.querySelector('#input').textContent).toEqual('1');

    rerender(<ImmutableInput value="not-same" onChange={() => {}} />);
    expect(container.querySelector('#input').textContent).toEqual('2');
  });
});
