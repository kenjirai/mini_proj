import React from 'react';
import SignerListForm from '../../SignerListForm';
import renderer from 'react-test-renderer';

test('Link changes the class when hovered', () => {
  const component = renderer.create(<SignerListForm />);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
