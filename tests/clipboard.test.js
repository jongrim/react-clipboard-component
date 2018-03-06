import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import Clipboard from '../src/clipboard.jsx';
import clipboard from 'clipboard-polyfill';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('clipboard-polyfill');

test('It renders with a render prop without crashing', () => {
  const component = renderer.create(<Clipboard render={({ copyData, copyText }) => <div />} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('It renders with a component prop without crashing', () => {
  const Button = ({ copyText, copyData }) => <button>button</button>;
  const component = renderer.create(<Clipboard component={Button} />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('It renders with children without crashing', () => {
  const component = renderer.create(
    <Clipboard>
      <div />
    </Clipboard>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe('With a render prop', () => {
  test('it passes the copyText function', done => {
    const wrapper = mount(
      <Clipboard
        render={({ copyData, copyText }) => (
          <div id="div" onClick={() => copyText('test').then(text => done())} />
        )}
      />
    );
    wrapper.find('#div').simulate('click');
  });

  test('it passes the copyData function', done => {
    const wrapper = mount(
      <Clipboard
        render={({ copyData, copyText }) => (
          <div id="div" onClick={() => copyData('text/plain', 'test').then(text => done())} />
        )}
      />
    );
    wrapper.find('#div').simulate('click');
  });
});

describe('With a component prop', () => {
  test('it passes the copyText function', done => {
    const Button = ({ copyText, copyData }) => (
      <button onClick={() => copyText('test').then(text => done())}>button</button>
    );

    const wrapper = mount(<Clipboard component={Button} />);
    wrapper.find('button').simulate('click');
  });

  test('it passes the copyData function', done => {
    const Button = ({ copyText, copyData }) => (
      <button onClick={() => copyData('text/plain', 'test').then(text => done())}>button</button>
    );

    const wrapper = mount(<Clipboard component={Button} />);
    wrapper.find('button').simulate('click');
  });
});

describe('With children', () => {
  test('it throws if text has not been provided', () => {
    const wrapper = shallow(
      <Clipboard>
        <div id="div" />
      </Clipboard>
    );
    expect(() => wrapper.simulate('click')).toThrow();
  });

  test('it does not call clipboard.writeText', () => {
    const wrapper = shallow(
      <Clipboard>
        <div id="div" />
      </Clipboard>
    );
    try {
      wrapper.simulate('click');
    } catch (e) {}
    expect(clipboard.writeText).not.toHaveBeenCalled();
  });

  test('it calls clipboard.writeText with the text prop', () => {
    const wrapper = shallow(
      <Clipboard text="test">
        <div id="div" />
      </Clipboard>
    );
    wrapper.simulate('click');
    expect(clipboard.writeText).toHaveBeenCalledWith('test');
  });

  test('it throws if not both the data and dataType prop have been passed', () => {
    const wrapper = shallow(
      <Clipboard data="<b>test</b>">
        <div id="div" />
      </Clipboard>
    );
    expect(() => wrapper.simulate('click')).toThrow();
  });

  test('it does not call clipboard.write', () => {
    const wrapper = shallow(
      <Clipboard data="<b>test</b>">
        <div id="div" />
      </Clipboard>
    );
    try {
      wrapper.simulate('click');
    } catch (e) {}
    expect(clipboard.write).not.toHaveBeenCalled();
  });

  test('it calls clipboard.write with the data and dataType props', () => {
    const wrapper = shallow(
      <Clipboard data="<b>test</b>" dataType="text/html">
        <div id="div" />
      </Clipboard>
    );
    wrapper.simulate('click');
    expect(clipboard.write.mock.calls[0][0].data).toBe('<b>test</b>');
    expect(clipboard.write.mock.calls[0][0].dataType).toBe('text/html');
  });

  test('it calls the onCopy prop after copying text', () => {
    const onCopy = jest.fn();
    const wrapper = shallow(
      <Clipboard data="<b>test</b>" dataType="text/html" onCopy={onCopy}>
        <div id="div" />
      </Clipboard>
    );
    wrapper.simulate('click');
    expect(onCopy).toHaveBeenCalled;
  });
});
