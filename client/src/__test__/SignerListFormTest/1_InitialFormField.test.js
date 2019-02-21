import React from 'react';
import { shallow } from 'enzyme';

import SignerListForm from '../../SignerListForm';

describe("Address Form Field With Buttons", function() {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SignerListForm />);
    wrapper.find(`#add-new-btn`).simulate('click');
  });

  describe('input field with property', function() {
    it('should display a text input for address', () => {
      expect(wrapper.find('input[type="text"]').length).toBe(1);
    });

    it('should set the initial address form field data-id to 0', () => {
      expect(wrapper.find('input[data-id=0]').length).toBe(1);
    });

    it('should initialize address form field with correct class name', () => {
      expect(wrapper.find(`input[className="address"]`).length).toBe(1);
    });
  });

  describe('delete button', function() {
    it('should have delete button with correct property set', () => {
      expect(wrapper.find('button[className="del-btn"]').length).toBe(1);
    });

    it('should have delete button data-id set to 0', () => {
      expect(wrapper.find('button[data-id=0]').length).toBe(1);
    });

    it('should have correct delete button id', () => {
      expect(wrapper.find('button[id="btn-signer-0"]').length).toBe(1);
    });
  });
});
