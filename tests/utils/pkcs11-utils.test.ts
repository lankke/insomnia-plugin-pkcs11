import { describe, it } from "mocha";
import {expect,assert} from "chai";
import { Pkcs11Utils} from '../../src/utils/pkcs11-utils';
import { createVerify } from "crypto";

describe('pkcs11-utils main functions',()=>{
  var pkcs11Obj: Pkcs11Utils;
  
  beforeEach(()=>{
    pkcs11Obj = new Pkcs11Utils('/usr/lib/opensc-pkcs11.so', 0, '123456');
    assert.isOk(pkcs11Obj,'pkcs11Utils is ok');
  });

  afterEach(()=>{
  });
  

  describe('pkcs11 sign function', ()=>{
    it('returns a signature with valid input',()=>{
      var result = pkcs11Obj.signData("testData");
      expect(result).not.to.be.empty;
    });

    it('throws an exception with invalid input',()=>{
      var errorFound = false;
      try {
        pkcs11Obj.signData('');
      } catch (error) {
        errorFound = true;
      }
      expect(errorFound).to.be.true;
    });

    it('returns an ASN.1 encoded Signature',()=>{
      var data = "twinky winky";
      var result: boolean;
      try {
        var signature = pkcs11Obj.signData(data);

        var verify = createVerify('sha512');

        result = verify.verify('key', signature,'base64');
        
      } catch (error) {
        result = false;
      }
      expect(result).to.be.true;
    });
  });

  describe('pkcs11 getObject function',()=>{
    it('returns a valid x509 certificate with valid input',()=>{
      var cert = pkcs11Obj.getObjectAsString('a1','certificate');

      expect(cert).to.have.string('CERTIFICATE');
    });
    it('throws an exception if the object does not exist',()=>{
      var ex = false;
      try {
        var obj = pkcs11Obj.getObjectAsString('xx','publicKey');
      } catch (error) {
        ex = true;
      }

      expect(ex).to.be.true;
    });
  });
  
  describe('pkcs11 verify function',()=>{
    it('verifies valid signatures against a valid public key',()=>{
      var result: boolean;
      var data = "a wholelottadata";
      try {
      var signature = pkcs11Obj.signData(data);
      
      result = pkcs11Obj.verify(data, signature);

      } catch (error) {
        result = false;
      }
  
        assert.isOk(result, 'Result was positive');
      
    });

  });

});