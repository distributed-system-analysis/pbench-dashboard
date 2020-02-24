import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AuthLayout from '@/components/AuthLayout';
import LoginHandler from './index';

const mockDispatch = jest.fn();
configure({ adapter: new Adapter() });
const wrapper = shallow(<LoginHandler.WrappedComponent dispatch={mockDispatch} />, {
  disableLifecycleMethods: true,
});

describe('test Login page component', () => {
  it('render with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('render AuthLayout component', () => {
    expect(wrapper.find(AuthLayout).length).toBe(1);
  });
});
