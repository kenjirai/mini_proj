import React from 'react';
import { shallow, mount } from 'enzyme';

import SignerListForm from '../../SignerListForm';

describe('Address Validation', function() {
  let wrapper;
  let mockInput;
  let firstMockInput;
  let secondMockInput;
  let address;
  let errMsg;

  const firstInputId = 0;
  const secondInputId = 1;

  beforeEach(() => {
    wrapper = shallow( < SignerListForm / > );
  });

  describe('Has 0x Prefix', function() {
    beforeEach(() => {
      //invalid address without 0x prefix
      address = "5A0b54D5dc17e0AadC383d2db43B0a0D3E029c";
      errMsg = "address must start with 0x prefix."
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
      expect(wrapper.state('signerInfo')[0].error).toEqual(errMsg);
    });

    it('should display error message for if address already exist', function() {
      expect(wrapper.find('#error-0').text()).toEqual(errMsg);
    });
  }); //---end tag has 0x prefix--//


  describe('Contains Space', function() {
    beforeEach(() => {
      //invalid address which contains space
      address = "0x5A0 4D5dc17e0AadC383d2db43B0a0D3E029c4c";
      errMsg = "address should not contain any space character."
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
      expect(wrapper.state('signerInfo')[0].error).toEqual(errMsg);
    });

    it('should display error message for if address already exist', function() {
      expect(wrapper.find('#error-0').text()).toEqual(errMsg);
    });
  }); //---end tag has space---//


  describe('Corrent Length', function() {
    beforeEach(() => {
      //invalid address with incorrect length
      address = "0x0b54D5dc17e0AadC383d2db43B0a0D3";
      errMsg = "address length should be 42 including 0x prefix at the front."
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
      expect(wrapper.state('signerInfo')[0].error).toEqual(errMsg);
    });

    it('should display error message for if address already exist', function() {
      expect(wrapper.find('#error-0').text()).toEqual(errMsg);
    });
  }); //---end tag correct length---//


  describe('Incorrect Hex Format', function() {
    beforeEach(() => {
      //invalid hex address
      address = "0xJJJ88CE2A7D7d8e725596b9da8b0E5dF4802e3D8";
      errMsg = "address should be in correct hex format."
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
      expect(wrapper.state('anyError')).toEqual(true);
    });

    it('should correctly update state singerInfo.error', function() {
      expect(wrapper.state('signerInfo')[0].error).toEqual(errMsg);
    });

    it('should display error message for if address already exist', function() {
      expect(wrapper.find('#error-0').text()).toEqual(errMsg);
    });
  }); //---end tag incorrect hex format---//


  describe('Unique Address', function() {
    beforeEach(() => {
      address = "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c";
      errMsg = `duplicate address ${address} already exist.`
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

    it('should correctly update state anyError', function() {
      expect(wrapper.state('anyError')).toEqual(true);
    });

    it('should correctly update state singerInfo.error', function() {
      expect(wrapper.state('signerInfo')[1].error).toEqual(errMsg);
    });

    it('should display error message for if address already exist', function() {
      expect(wrapper.find('#error-1').text()).toEqual(errMsg);
    });
  }); //---end tag unique address ---//
}); // ---end tag main tag ---//
