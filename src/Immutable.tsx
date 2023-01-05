import { supportRef } from 'rc-util/lib/ref';
import * as React from 'react';

const ImmutableContext = React.createContext<number>(0);

export type CompareProps<T extends React.ComponentType<any>> = (
  prevProps: Readonly<React.ComponentProps<T>>,
  nextProps: Readonly<React.ComponentProps<T>>,
) => boolean;

/**
 * Get render update mark by `makeImmutable` root.
 * Do not deps on the return value as render times
 * but only use for `useMemo` or `useCallback` deps.
 */
export function useImmutableMark() {
  return React.useContext(ImmutableContext);
}

/**
 * Wrapped Component will be marked as Immutable.
 * When Component parent trigger render,
 * it will notice children component (use with `responseImmutable`) node that parent has updated.

 * @param Component Passed Component
 * @param triggerRender Customize trigger `responseImmutable` children re-render logic. Default will always trigger re-render when this component re-render.
 */
export function makeImmutable<T extends React.ComponentType<any>>(
  Component: T,
  shouldTriggerRender?: CompareProps<T>,
): T {
  const refAble = supportRef(Component);

  const ImmutableComponent = function (props: any, ref: any) {
    const refProps = refAble ? { ref } : {};
    const renderTimesRef = React.useRef(0);
    const prevProps = React.useRef(props);

    if (
      // Always trigger re-render if not provide `notTriggerRender`
      !shouldTriggerRender ||
      shouldTriggerRender(prevProps.current, props)
    ) {
      renderTimesRef.current += 1;
    }

    prevProps.current = props;

    return (
      <ImmutableContext.Provider value={renderTimesRef.current}>
        <Component {...props} {...refProps} />
      </ImmutableContext.Provider>
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
export function responseImmutable<T extends React.ComponentType<any>>(
  Component: T,
  propsAreEqual?: CompareProps<T>,
): T {
  const refAble = supportRef(Component);

  const ImmutableComponent = function (props: any, ref: any) {
    const refProps = refAble ? { ref } : {};
    useImmutableMark();

    return <Component {...props} {...refProps} />;
  };

  if (process.env.NODE_ENV !== 'production') {
    ImmutableComponent.displayName = `ImmutableResponse(${
      Component.displayName || Component.name
    })`;
  }

  return refAble
    ? React.memo(React.forwardRef(ImmutableComponent), propsAreEqual)
    : (React.memo(ImmutableComponent, propsAreEqual) as any);
}
