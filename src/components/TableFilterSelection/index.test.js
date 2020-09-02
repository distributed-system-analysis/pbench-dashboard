import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TableFilterSelection from './index';
import Button from '../Button';

const mockProps = {
  onFilterTable: jest.fn(),
  filters: {
    benchmark_name: ['uperf'],
    benchmark_version: ['1.0.0'],
    instances: [1, 8],
    message_size_bytes: [64, 256, 1024, 8192],
    primary_metric: ['Gb_sec', 'trans_sec'],
    protocol: ['tcp'],
    test_type: ['stream', 'maerts', 'bidirec', 'rr'],
  },
};

const mockDispatch = jest.fn();
configure({ adapter: new Adapter() });
const wrapper = shallow(<TableFilterSelection dispatch={mockDispatch} {...mockProps} />, {
  lifecycleExperimental: true,
});

describe('test rendering of TableFilterSelection page component', () => {
  it('render with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('check rendering', () => {
    expect(wrapper.find('Select').length).toEqual(7);
    expect(wrapper.find('Form')).toHaveLength(1);
    expect(wrapper.find('Button')).toHaveLength(2);
  });
});

describe('test interaction of TableFilterSelection page component', () => {
  it('Check click event to call onFilterTable', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onFilterTable');
    wrapper.instance().forceUpdate();
    wrapper
      .find(Button)
      .first()
      .props()
      .onClick();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('Check click event to call onClearFilters', () => {
    const spy = jest.spyOn(wrapper.instance(), 'onClearFilters');
    wrapper.instance().forceUpdate();
    wrapper
      .find(Button)
      .last()
      .props()
      .onClick();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
