import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ComparisonSelect from './index';

const mockProps = {
  selectedResults: [],
  selectedControllers: ['controller1', 'controller2'],
  iterations: [],
  iterationParams: {},
};

const mockDispatch = jest.fn();
configure({ adapter: new Adapter() });
const wrapper = shallow(
  <ComparisonSelect.WrappedComponent dispatch={mockDispatch} {...mockProps} />,
  { disableLifecycleMethods: true }
);

describe('test ComparisonSelect page component', () => {
  it('render with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
