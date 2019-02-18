import React from 'react';
import { shallow, mount } from 'enzyme';

import SignerListForm from '../../SignerListForm';

describe("Initial SingerListForm Component State", function() {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<SignerListForm  />);
  });

  describe('State SignerInfo Array', function() {
    it('intial state singerInfo array should be length of 1', function() {
      expect(wrapper.state('signerInfo').length).toEqual(1);
    });

    it('should initialize state address with empty value', function() {
      expect(wrapper.state('signerInfo')[0].address.length).toEqual(0);
    });

    it('should initialize state error with empty value', function() {
      expect(wrapper.state('signerInfo')[0].error.length).toEqual(0);
    });
  });

  describe('state anyError', function() {
    it('should initialize state anyError with empty value', function() {
      expect(wrapper.state('anyError').length).toEqual(0);
    });
  });

});
