import React from 'react';
import { shallow } from 'enzyme';
import SiderMenu from './index';

const mockDispatch = jest.fn();
const wrapper = shallow(<SiderMenu dispatch={mockDispatch} />);

describe('test rendering of Button component', () => {
  it('render SiderMenu with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
