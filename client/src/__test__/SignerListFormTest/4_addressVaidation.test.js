import React from 'react';
import { shallow, mount } from 'enzyme';

import SignerListForm from '../../SignerListForm';

describe('AddressValidation', function() {
  let wrapper;
  let mockInput;
  let firstMockInput;
  let secondMockInput;
  let address;

  const firstInputId = 0;
  const secondInputId = 1;

  beforeEach(() => {
    wrapper = shallow( < SignerListForm / > );
  });

  describe('Unique Address', function() {
    beforeEach(() => {

      address = "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c";
      firstMockInput = {
        value: address,
        dataset: {
          id: 0
        },
        className: "address"
      }
      wrapper.find(`input[data-id=${firstInputId}]`).simulate('change', {
        target: firstMockInput
      });
      wrapper.find(`#add-new-btn`).simulate('click');

      secondMockInput = {
        value: address,
        dataset: {
          id: 1
        },
        className: "address"
      }
      wrapper.find(`input[data-id=${secondInputId}]`).simulate('change', {
        target: secondMockInput
      });
    });

    it('should correctly update state singerInfo.error and anyError', function() {
      expect(wrapper.state('anyError')).toEqual(true);
    });

    it('should correctly update state singerInfo.error', function() {
      expect(wrapper.state('signerInfo')[1].error).toEqual(`duplicate address ${address} already exist`);
    });

    it('should display error message for if address already exist', function() {
      expect(wrapper.find('#error-1').text()).toEqual(`duplicate address ${address} already exist`);
    });
  });

  describe('isAddressValid', function() {
    beforeEach(()=> {
      //invalid hex address
      address = "0xJJJ88CE2A7D7d8e725596b9da8b0E5dF4802e3D8";
      mockInput = {
        value: address,
        dataset: {
          id: 0
        },
        className: "address"
      }
      wrapper.find(`input[data-id=${firstInputId}]`).simulate('change', {
        target: mockInput
      });
    });

    it('should correctly update state singerInfo.error', function() {
      expect(wrapper.state('signerInfo')[0].error).toEqual(`address should be in correct hex format`);
    });

    it('should correctly update state singerInfo.error', function() {
      expect(wrapper.state('anyError')).toEqual(true);
    });

    it('should display error message for if address already exist', function() {
      expect(wrapper.find('#error-0').text()).toEqual(`address should be in correct hex format`);
    });
  });//---end tag isAddressValid---//

  describe('hasSpace', function() {
    beforeEach(()=> {
      //address contains space
      address = "0xJJ 88CE2A7D7d8e725596b9da8b0E5dF4802e3D8";
      mockInput = {
        value: address,
        dataset: {
          id: 0
        },
        className: "address"
      }
      wrapper.find(`input[data-id=${firstInputId}]`).simulate('change', {
        target: mockInput
      });
    });

    it('should correctly update state anyError', function() {
      expect(wrapper.state('anyError')).toEqual(true);
    });

    it('should correctly update state singerInfo.error', function() {
      expect(wrapper.state('signerInfo')[0].error).toEqual(`address should not contain any space character`);
    });

    it('should display error message for if address already exist', function() {
      expect(wrapper.find('#error-0').text()).toEqual(`address should not contain any space character`);
    });
  });//---end tag isAddressValid---//
});
