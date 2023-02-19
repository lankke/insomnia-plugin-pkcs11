import { Pkcs11UtilsDto } from "../dto/pkcs11-utils-dto";
import { existsSync, openSync, writeFileSync, readFileSync, unlinkSync, closeSync} from 'fs';
import { spawnSync } from "child_process";
import { HSM_DEFAULT_MECHANISM } from '../../constants';
import { Pkcs11Tool } from "../dto/pkcs11-tool-dto";
import { Pkcs11ToolAccess } from "../access/pkcs11-tool-access";
import { sign } from "crypto";


export class Pkcs11Utils implements Pkcs11UtilsDto{
  mechanism: string;
  module: string;
  pinNumber: string;
  slotId: number;

  constructor(module: string, slotId: number, pinNumber: string, label: string, mechanism?: string){
    this.module = module;
    this.slotId = slotId;
    this.pinNumber = pinNumber;
    this.mechanism = mechanism || HSM_DEFAULT_MECHANISM;
  }

  getObjectAsString(label: string, type: string): string {
    var pkcs11: Pkcs11ToolAccess;
    var errorStr: string;

    if(!label) throw "'label' must be a valid string";
    if(!type) throw "'type' must be a valid string";
    return "";
  }


  /**
   * signData - Signs data with a USB HSM token using Pkcs11 functions
   * 
   * Dependency: This implementation requires pkcs11-tool to be installed
   *             on your machine. See opensc-pkcs11 documentation for more details.
   * 
   *             A USB HSM token must also be present in order for this function to work
   * 
   * @param data 
   * @returns string: signature
   */
  signData(label:string, data: string): string {
    var signature: string;
    var pkcs11: Pkcs11ToolAccess;

    if(data.length < 1) throw "Invalid data given to sign function";
    try {
      pkcs11 = new Pkcs11ToolAccess({
        modulePath: this.module,
        pin: this.pinNumber,
        slot: this.slotId
      });

      signature = pkcs11.signData(label, data);

      if(!signature) throw new Error("Signature was empty");
      
    } catch (error) {
      console.error("There was an error!",error);
    }

    return signature;
  }

  verify(label: string, data: string, signature: string): boolean {
    var result = false;
    try {
      var pkcs11 = new Pkcs11ToolAccess(
      {
        modulePath: this.module,
        pin: this.pinNumber,
        slot: this.slotId
      });

      result = pkcs11.verify(label, data, signature);
    } catch (error) {
      console.error(error);
      result = false;
    }
    return result;
  }
}
