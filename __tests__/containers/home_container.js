import React from 'react';
import { configureStore } from '../../src/apps/discover/routes';
import HomeContainer from '../../src/apps/discover/containers/home_container';

const store = configureStore({});

describe('HomeContainer', () => {
  it('should render the home container', () => {
    const wrapper = shallow(<HomeContainer store={store} />);
    expect(wrapper).toMatchSnapshot();
  });
});