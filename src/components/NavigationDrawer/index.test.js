import React from 'react';
import { shallow } from 'enzyme';
import NavigationDrawer from './index';

const mockDispatch = jest.fn();
const wrapper = shallow(<NavigationDrawer dispatch={mockDispatch} />);

describe('test rendering of Navigation Drawer component', () => {
  it('render SiderMenu with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
