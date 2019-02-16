import React from 'react';
import { shallow } from 'enzyme';

import SignerListForm from '../../SignerListForm';

describe("Add New Signer Address", function() {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SignerListForm  />);
  });

  describe('handleChange', function() {
    let address;
    let mockInput;
    beforeEach(() => {
      address = "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c";
      mockInput = {
        value:address,
        dataset: {id:0},
        className:"address"
      }
      wrapper.find('input').simulate('change', {target: mockInput});
      expect(wrapper.state('signerInfo').length).toEqual(1);
    });

    it('should update state singerInfo[address] with correct address', function() {
      expect(wrapper.state('signerInfo')[0].address).toEqual(address);
    });

    it('should not update state singerInfo[error] for correct address', function() {
      expect(wrapper.state('signerInfo')[0].error.length).toEqual(0);
    });

    it('should not update state anyError for correct address', function() {
      expect(wrapper.state('anyError')).toEqual(false);
    });

    it('should not update state addressList', function() {
      expect(wrapper.state('addressList').length).toEqual(0);
    });
  });
});

//wrapper.find('a').simulate('click');
