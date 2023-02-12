import {beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';
import {Pkcs11ToolAccess} from '../../src/access/pkcs11-tool-access';
import { HSM_MODULE_PATH, HSM_TEST_PIN, HSM_TEST_SLOT_ID } from '../../constants';


describe('Pkcs11ToolAccess',()=>{
  var pkcs11: Pkcs11ToolAccess;

  beforeEach(()=>{
    //TODO: GET TEST ACCESS VARS AS ENV VARIABLES
    pkcs11 = new Pkcs11ToolAccess({modulePath: HSM_MODULE_PATH, slot: HSM_TEST_SLOT_ID, pin: HSM_TEST_PIN });
  });

  it('instantiates correctly',()=>{
    expect(pkcs11).to.have.own.property('modulePath');
    expect(pkcs11).to.have.own.property('slot');
    expect(pkcs11).to.have.own.property('pin');
  });

  describe('validateAccessConfig',()=>{

  });

});