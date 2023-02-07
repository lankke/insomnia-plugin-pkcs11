import { describe, it } from "mocha";
import {expect,assert} from "chai";
import * as pkcs11Utils from '../../src/utils/pkcs11-utils';

describe('pkcs11-utils main functions',()=>{
  assert.isOk(pkcs11Utils,'pkcs11Utils is ok');

  describe('pkcs11 sign function', ()=>{
    it('returns a signature with valid input',()=>{
      
    });

    it('throws an exception with invalid input',()=>{

    });

    it('returns a signature that can be verified with a private key',()=>{

    });

    it('returns an ASN.1 encoded Signature',()=>{

    });
  });

  describe('pkcs11 getObject function',()=>{
    it('returns a valid x509 certificate with valid input',()=>{

    });
    it('throws an exception if the object does not exist',()=>{

    });
  });
  
  describe('pkcs11 verify function',()=>{
    it('verifies valid signatures against a valid public key',()=>{

    });
    it('verifies a valid signature against a valid certificate',()=>{

    });
  });

});