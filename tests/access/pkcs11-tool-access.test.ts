import {beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';
import {Pkcs11ToolAccess} from '../../src/access/pkcs11-tool-access';
import { HSM_MODULE_PATH, HSM_TEST_PIN, HSM_TEST_SLOT_ID, SIGN_RAW_DATA_FILE, SIGN_SIGNATURE_FILE } from '../../constants';
import { Pkcs11Access } from '../../src/dto/pkcs11-access-dto';

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
      it('contains the object type flag',()=>{
        expect(args).to.contain('--type');
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
      })
      
    });
  });
 

});