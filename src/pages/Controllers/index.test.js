import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Table from '@/components/Table';
import Controllers from './index';
import AntdDatePicker from '@/components/DatePicker';

const mockDispatch = jest.fn();
configure({ adapter: new Adapter() });
const wrapper = shallow(<Controllers.WrappedComponent dispatch={mockDispatch} />, {
  disableLifecycleMethods: true,
});

describe('test Controllers page component', () => {
  it('render with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('render Table component', () => {
    expect(wrapper.find(Table).length).toBe(1);
  });

  it('render DatePicker component', () => {
    expect(wrapper.find(AntdDatePicker).length).toBe(1);
  });
});
