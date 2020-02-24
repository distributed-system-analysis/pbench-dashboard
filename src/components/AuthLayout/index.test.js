import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Dropdown } from '@patternfly/react-core';
import AuthLayout from './index';

const mockProps = {
  toPreview: 'Mock Preview',
  heading: 'Mock heading',
  backOpt: true,
  onSelect: jest.fn,
  onToggle: jest.fn,
};

const mockDispatch = jest.fn();
configure({ adapter: new Adapter() });
const wrapper = shallow(<AuthLayout.WrappedComponent dispatch={mockDispatch} {...mockProps} />, {
  disableLifecycleMethods: true,
});

describe('test Explore page component', () => {
  it('render with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('check Dropdown interaction', () => {
  it('check components', () => {
    expect(wrapper.find(Dropdown).length).toEqual(1);
  });
  it('check on Select function', () => {
    const mockonSelect = jest.spyOn(wrapper.instance(), 'onSelect');
    wrapper.setProps({ onSelect: mockonSelect });
    wrapper.find(Dropdown).prop('onSelect')({ value: ['val'] });
    expect(mockonSelect).toHaveBeenCalled();
    expect(wrapper.state('isOpen')).toEqual(true);
  });
});

describe('test functions', () => {
  it('check onToggle function', () => {
    // const spy = jest.spyOn(wrapper.instance(), 'onToggle');
    // wrapper.instance().forceUpdate();
    // wrapper
    //   .find("#toggle-id")
    //   .first()
    //   .props()
    //   .onClick();
    // expect(spy).toHaveBeenCalledTimes(1);
    // const container = mount(<AuthLayout {...mockProps} />);
    // container.debug();
    // container.detach();
  });
});
