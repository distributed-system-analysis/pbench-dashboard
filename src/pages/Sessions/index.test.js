import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Explore from './index';

const mockProps = {};

const mockDispatch = jest.fn();
configure({ adapter: new Adapter() });
const wrapper = shallow(<Explore.WrappedComponent dispatch={mockDispatch} {...mockProps} />, {
  disableLifecycleMethods: true,
});

describe('test Explore page component', () => {
  it('should render with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
