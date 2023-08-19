import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import {
  createContext,
  createImmutable,
  makeImmutable,
  responseImmutable,
  useContext,
} from '../src';
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

    it('customize re-render logic', () => {
      const MyRoot = ({
        children,
      }: {
        children?: React.ReactNode;
        trigger?: string;
        notTrigger?: string;
      }) => {
        return (
          <>
            <RenderTimer id="root" />
            {children}
          </>
        );
      };

      const ImmutableMyRoot = makeImmutable(MyRoot, (prev, next) => {
        return prev.trigger !== next.trigger;
      });

      const { container, rerender } = render(
        <ImmutableMyRoot>
          <ImmutableRaw />
        </ImmutableMyRoot>,
      );
      expect(container.querySelector('#root').textContent).toEqual('1');
      expect(container.querySelector('#raw').textContent).toEqual('1');

      // Update `notTrigger`: No Update
      rerender(
        <ImmutableMyRoot notTrigger="bamboo">
          <ImmutableRaw />
        </ImmutableMyRoot>,
      );
      expect(container.querySelector('#root').textContent).toEqual('2');
      expect(container.querySelector('#raw').textContent).toEqual('1');

      // Update `trigger`: Full Update
      rerender(
        <ImmutableMyRoot trigger="little" notTrigger="bamboo">
          <ImmutableRaw />
        </ImmutableMyRoot>,
      );
      expect(container.querySelector('#root').textContent).toEqual('3');
      expect(container.querySelector('#raw').textContent).toEqual('2');
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

    const ImmutableInput = responseImmutable(Input, (prev, next) => prev.value === next.value);

    const { container, rerender } = render(<ImmutableInput value="same" onChange={() => {}} />);
    expect(container.querySelector('#input').textContent).toEqual('1');

    rerender(<ImmutableInput value="same" onChange={() => {}} />);
    expect(container.querySelector('#input').textContent).toEqual('1');

    rerender(<ImmutableInput value="not-same" onChange={() => {}} />);
    expect(container.querySelector('#input').textContent).toEqual('2');
  });

  describe('createImmutable', () => {
    const { responseImmutable: responseCreatedImmutable, makeImmutable: makeCreatedImmutable } =
      createImmutable();

    it('nest should follow root', () => {
      // child
      const Little = responseCreatedImmutable(() => <RenderTimer id="little" />);

      // parent
      const Bamboo = makeCreatedImmutable(() => (
        <>
          <RenderTimer id="bamboo" />
          <Little />
        </>
      ));

      // root
      const Light = makeCreatedImmutable(() => {
        const [times, setTimes] = React.useState(0);

        return (
          <>
            <button onClick={() => setTimes(i => i + 1)}>{times}</button>
            <RenderTimer id="light" />
            <Bamboo />
          </>
        );
      });

      const { container, rerender } = render(<Light />);

      for (let i = 0; i < 10; i += 1) {
        rerender(<Light />);
      }
      expect(container.querySelector('#light')!.textContent).toEqual('11');
      expect(container.querySelector('#bamboo')!.textContent).toEqual('11');
      expect(container.querySelector('#little')!.textContent).toEqual('11');

      for (let i = 0; i < 10; i += 1) {
        fireEvent.click(container.querySelector('button')!);
      }
      expect(container.querySelector('#light')!.textContent).toEqual('21');
      expect(container.querySelector('#bamboo')!.textContent).toEqual('21');
      expect(container.querySelector('#little')!.textContent).toEqual('11');
    });
  });
});
