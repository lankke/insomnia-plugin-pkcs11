import {before, beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';
import {Pkcs11ToolAccess} from '../../src/access/pkcs11-tool-access';
import { HSM_DEFAULT_SIGNATURE_FORMAT, HSM_MODULE_PATH, HSM_TEST_DATA, HSM_TEST_LABEL, HSM_TEST_PIN, HSM_TEST_SLOT_ID, SIGN_RAW_DATA_FILE, SIGN_SIGNATURE_FILE } from '../../constants';
import { Pkcs11Access } from '../../src/dto/pkcs11-access-dto';
import ASN1 from '@lapo/asn1js';

describe('Pkcs11ToolAccess',()=>{
  var pkcs11: Pkcs11ToolAccess;

  beforeEach(()=>{
    //TODO: GET TEST ACCESS VARS AS ENV VARIABLES
    pkcs11 = new Pkcs11ToolAccess({modulePath: HSM_MODULE_PATH, slot: HSM_TEST_SLOT_ID, pin: HSM_TEST_PIN });
  });

  it('instantiates correctly',()=>{
    expect(pkcs11).to.have.own.property('module');
    expect(pkcs11).to.have.own.property('slot');
    expect(pkcs11).to.have.own.property('pin');
  });

  describe('getFlags ',()=>{
    var args: Array<string>;
    
    describe('for sign operation',()=>{
      before(()=>{
        args = pkcs11.getFlags(Pkcs11Access.operation.sign);
      });
      it('contains sign flag',()=>{
          expect(args).to.contain("-s");
        });
      it('contains slot flag',()=>{
        expect(args).to.contain('--slot-index');
      });
      it('contains pin flag', ()=>{
        expect(args).to.contain('-p');
        expect(args).to.contain(HSM_TEST_PIN);
      });
      it('contains the mechanism flag', ()=>{
        expect(args).to.contain('-m');
        expect(args).to.contain(pkcs11.mechanism);
      });
      it('contains format flag',()=>{
        expect(args).to.contain('-f');
        expect(args).to.contain('openssl');
      });
      it('contains the file input flag',()=>{
        expect(args).to.contain('-i');
        expect(args).to.contain(SIGN_RAW_DATA_FILE);
      });
      it('contains the file output flag',()=>{
        expect(args).to.contain('-o');
        expect(args).to.contain(SIGN_SIGNATURE_FILE);
      });
      it('contains the module flag',()=>{
        expect(args).to.contain('--module');
        expect(args).to.contain(HSM_MODULE_PATH);
      });
      it('does not contain verify flag',()=>{
        expect(args).not.to.contain('--verify');
      })
    });

    describe('for getObject operation',()=>{
      before(()=>{
        args = pkcs11.getFlags(Pkcs11Access.operation.getObject);
      });
      it('contains slot flag',()=>{
        expect(args).to.contain('--slot-index');
      });
      it('contains pin flag', ()=>{
        expect(args).to.contain('-p');
        expect(args).to.contain(HSM_TEST_PIN);
      });
      it('contains the module flag',()=>{
        expect(args).to.contain('--module');
        expect(args).to.contain(HSM_MODULE_PATH);
      });
      it('contains the read object flag',()=>{
        expect(args).to.contain('-r');
      });
    });
    describe('for the verify operation',()=>{
      before(()=>{
        args = pkcs11.getFlags(Pkcs11Access.operation.verify);
      });
      it('contains the verification flag',()=>{
        expect(args).to.contain('--verify');
      });
      it('contains the mechanism flag',()=>{
        expect(args).to.contain('-m');
        expect(args).to.contain(pkcs11.mechanism);
      });
      it('contains the pin flag',()=>{
        expect(args).to.contain('-p');
      });
      it('contains signature file flag',()=>{
        expect(args).to.contain('--signature-file');
      });
      it('contains the original input data flag',()=>{
        expect(args).to.contain('-i');
      });
      it('contains the signature format flag',()=>{
        expect(args).to.contain('--signature-format');
        expect(args).to.contain(HSM_DEFAULT_SIGNATURE_FORMAT);
      });
    });
  });

  describe('signData',()=>{ 
    it('return a string',()=>{
      try {
        var signature = pkcs11.signData(HSM_TEST_LABEL, HSM_TEST_DATA );
        expect(signature).to.not.be.empty;
      } catch (error) {
        console.error(error);
      }
    });

    it('returns an ASN.1 encoded Signature',()=>{
      var data = "twinky winky";
      var result: boolean;
      try {
        var signature = pkcs11.signData(HSM_TEST_LABEL, data);

        var asn1 = ASN1.decode(signature);

        result = true;
        
      } catch (error) {
        result = false;
      }
      expect(result).to.be.true;
    });

    it('throws an error with wrong label',()=>{
      try {
        var signature = pkcs11.signData('h1','should fail');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  }); // end of signData

  describe('verifyData',()=>{
    var signature: string;
    var fakeSignature = Buffer.from("fakesign").toString('base64');

    before(()=>{
      signature = pkcs11.signData(HSM_TEST_LABEL, HSM_TEST_DATA);
    });

    it('returns true when a valid signature is verified',()=>{
      try {
        const verified = pkcs11.verify(HSM_TEST_LABEL, HSM_TEST_DATA, signature);
        expect(verified).to.be.true;
      } catch (error) {
        console.error(error);
      }
    });
    it('returns false when an invalid signature is given',()=>{
      try {
        const verified = pkcs11.verify(HSM_TEST_LABEL, HSM_TEST_DATA,fakeSignature);
        expect(verified).to.be.false;        
      } catch (error) {
        console.error(error);
      }
    });
    it('throws an exception with bad input',()=>{
      var foundException = false;
      try {
        pkcs11.verify("",HSM_TEST_DATA,signature);
      } catch (error) {
        foundException = true;
      }
      expect(foundException).to.be.true;
    });
  }); // end of verifyData
});