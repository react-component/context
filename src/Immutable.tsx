import { supportRef } from 'rc-util/lib/ref';
import * as React from 'react';

const RenderContext = React.createContext<number>(0);

/**
 * Wrapped Component will be marked as Immutable.
 * When Component parent trigger render,
 * it will notice children component (use with `responseImmutable`) node that parent has updated.
 */
export function makeImmutable<T extends React.ComponentType<any>>(Component: T): T {
  const refAble = supportRef(Component);

  const ImmutableComponent = function (props: any, ref: any) {
    const refProps = refAble ? { ref } : {};
    const renderTimesRef = React.useRef(0);
    renderTimesRef.current += 1;

    return (
      <RenderContext.Provider value={renderTimesRef.current}>
        <Component {...props} {...refProps} />
      </RenderContext.Provider>
    );
  };

  if (process.env.NODE_ENV !== 'production') {
    ImmutableComponent.displayName = `ImmutableRoot(${Component.displayName || Component.name})`;
  }

  return refAble ? React.forwardRef(ImmutableComponent) : (ImmutableComponent as any);
}

/**
 * Wrapped Component with `React.memo`.
 * But will rerender when parent with `makeImmutable` rerender.
 */
export function responseImmutable<T extends React.ComponentType<any>>(Component: T): T {
  const refAble = supportRef(Component);

  const ImmutableComponent = function (props: any, ref: any) {
    const refProps = refAble ? { ref } : {};
    React.useContext(RenderContext);

    return <Component {...props} {...refProps} />;
  };

  if (process.env.NODE_ENV !== 'production') {
    ImmutableComponent.displayName = `ImmutableResponse(${
      Component.displayName || Component.name
    })`;
  }

  return refAble
    ? React.memo(React.forwardRef(ImmutableComponent))
    : (React.memo(ImmutableComponent) as any);
}
