import React from 'react';
import { shallow } from 'enzyme';
import SearchBar from './index';

const mockProps = {
  onSearch: jest.fn(),
};

const mockDispatch = jest.fn();
const wrapper = shallow(<SearchBar dispatch={mockDispatch} {...mockProps} />);

describe('test rendering of TableFilterSelection page component', () => {
  it('render with empty props', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
