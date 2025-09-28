import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import useEvent from '@rc-component/util/lib/hooks/useEvent';
import isEqual from '@rc-component/util/lib/isEqual';
import * as React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

export type Selector<ContextProps, SelectorValue = ContextProps> = (
  value: ContextProps,
) => SelectorValue;

export type Trigger<ContextProps> = (value: ContextProps) => void;

export type Listeners<ContextProps> = Set<Trigger<ContextProps>>;

export interface Context<ContextProps> {
  getValue: () => ContextProps;
  listeners: Listeners<ContextProps>;
}

export interface ContextSelectorProviderProps<T> {
  value: T;
  children?: React.ReactNode;
}

export interface SelectorContext<ContextProps> {
  Context: React.Context<Context<ContextProps>>;
  Provider: React.ComponentType<ContextSelectorProviderProps<ContextProps>>;
  defaultValue?: ContextProps;
}

export function createContext<ContextProps>(
  defaultValue?: ContextProps,
): SelectorContext<ContextProps> {
  const Context = React.createContext<Context<ContextProps>>(undefined);

  const Provider = ({ value, children }: ContextSelectorProviderProps<ContextProps>) => {
    const valueRef = React.useRef(value);
    valueRef.current = value;

    const [context] = React.useState<Context<ContextProps>>(() => ({
      getValue: () => valueRef.current,
      listeners: new Set(),
    }));

    useLayoutEffect(() => {
      unstable_batchedUpdates(() => {
        context.listeners.forEach(listener => {
          listener(value);
        });
      });
    }, [value]);

    return <Context.Provider value={context}>{children}</Context.Provider>;
  };

  return { Context, Provider, defaultValue };
}

/** e.g. useSelect(userContext) => user */
export function useContext<ContextProps>(holder: SelectorContext<ContextProps>): ContextProps;

/** e.g. useSelect(userContext, user => user.name) => user.name */
export function useContext<ContextProps, SelectorValue>(
  holder: SelectorContext<ContextProps>,
  selector: Selector<ContextProps, SelectorValue>,
): SelectorValue;

/** e.g. useSelect(userContext, ['name', 'age']) => user { name, age } */
export function useContext<ContextProps, SelectorValue extends Partial<ContextProps>>(
  holder: SelectorContext<ContextProps>,
  selector: (keyof ContextProps)[],
): SelectorValue;

/** e.g. useSelect(userContext, 'name') => user.name */
export function useContext<ContextProps, PropName extends keyof ContextProps>(
  holder: SelectorContext<ContextProps>,
  selector: PropName,
): ContextProps[PropName];

export function useContext<ContextProps, SelectorValue>(
  holder: SelectorContext<ContextProps>,
  selector?: Selector<ContextProps, any> | (keyof ContextProps)[] | keyof ContextProps,
) {
  const eventSelector = useEvent<Selector<ContextProps, SelectorValue>>(
    typeof selector === 'function'
      ? selector
      : ctx => {
          if (selector === undefined) {
            return ctx;
          }

          if (!Array.isArray(selector)) {
            return ctx[selector];
          }

          const obj = {} as SelectorValue;
          selector.forEach(key => {
            (obj as any)[key] = ctx[key];
          });
          return obj;
        },
  );
  const context = React.useContext(holder?.Context);
  const { listeners, getValue } = context || {};

  const valueRef = React.useRef<SelectorValue>();
  valueRef.current = eventSelector(context ? getValue() : holder?.defaultValue);
  const [, forceUpdate] = React.useState({});

  useLayoutEffect(() => {
    if (!context) {
      return;
    }

    function trigger(nextValue: ContextProps) {
      const nextSelectorValue = eventSelector(nextValue);
      if (!isEqual(valueRef.current, nextSelectorValue, true)) {
        forceUpdate({});
      }
    }

    listeners.add(trigger);

    return () => {
      listeners.delete(trigger);
    };
  }, [context]);

  return valueRef.current;
}
