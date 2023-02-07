import * as pkcs11 from '../../src/utils/pkcs11';

describe('utils suite', ()=>{
  describe('initToken',()=>{

    it('should instantiate correctly',()=>{
      pkcs11.initToken();
    });

  });

});