import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { createContext, useContext } from '../src';
import { RenderTimer, Value } from './common';

describe('Basic', () => {
  interface User {
    name: string;
    age: number;
  }

  const UserContext = createContext<User>();

  const Root = ({ children }: { children?: React.ReactNode }) => {
    const [name, setName] = React.useState('bamboo');
    const [age, setAge] = React.useState(30);

    return (
      <UserContext.Provider value={{ name, age }}>
        <input id="name" value={name} onChange={e => setName(e.target.value)} />
        <input id="age" value={age} onChange={e => setAge(Number(e.target.value))} />

        {children}
      </UserContext.Provider>
    );
  };

  function changeValue(container: HTMLElement, id: string, value: string) {
    fireEvent.change(container.querySelector(`#${id}`), {
      target: {
        value,
      },
    });
  }

  it('raw', () => {
    const Raw = () => {
      const user = useContext(UserContext);

      return (
        <>
          <Value id="value" value={user} />
          <RenderTimer id="raw" />
        </>
      );
    };

    const { container } = render(
      <Root>
        <Raw />
      </Root>,
    );

    // Mount
    expect(container.querySelector('#raw')!.textContent).toEqual('1');

    // Update `name`: Full Update
    changeValue(container, 'name', 'light');
    expect(container.querySelector('#raw')!.textContent).toEqual('2');
    expect(container.querySelector('#value')!.textContent).toEqual(
      JSON.stringify({
        name: 'light',
        age: 30,
      }),
    );

    // Update `age`: Full Update
    changeValue(container, 'age', '20');
    expect(container.querySelector('#raw')!.textContent).toEqual('3');
    expect(container.querySelector('#value')!.textContent).toEqual(
      JSON.stringify({
        name: 'light',
        age: 20,
      }),
    );
  });

  it('PropName', () => {
    const PropName = ({ name }: { name: keyof User }) => {
      const value = useContext(UserContext, name);

      return (
        <>
          <Value id={`${name}-value`} value={value} />
          <RenderTimer id={`${name}-times`} />
        </>
      );
    };

    const { container } = render(
      <Root>
        <PropName name="name" />
        <PropName name="age" />
      </Root>,
    );

    // Mount
    expect(container.querySelector('#name-times')!.textContent).toEqual('1');
    expect(container.querySelector('#age-times')!.textContent).toEqual('1');

    // Update `name`: Partial Update
    changeValue(container, 'name', 'light');
    expect(container.querySelector('#name-times')!.textContent).toEqual('2');
    expect(container.querySelector('#name-value')!.textContent).toEqual('light');
    expect(container.querySelector('#age-times')!.textContent).toEqual('1');

    // Update `age`: Partial Update
    changeValue(container, 'age', '20');
    expect(container.querySelector('#name-times')!.textContent).toEqual('2');
    expect(container.querySelector('#age-times')!.textContent).toEqual('2');
    expect(container.querySelector('#age-value')!.textContent).toEqual('20');
  });
});
