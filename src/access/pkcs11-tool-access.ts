import { Pkcs11UtilsDto } from "../dto/pkcs11-utils-dto";
import { Pkcs11Access } from "../dto/pkcs11-access-dto";
import { SIGN_SIGNATURE_FILE, SIGN_RAW_DATA_FILE, HSM_DEFAULT_OBJECT_TYPE, HSM_DEFAULT_MECHANISM, VERIFY_SIGNATURE_FILE, VERIFY_RAW_DATA_FILE } from "../../constants";

export class Pkcs11ToolAccess implements Pkcs11UtilsDto{
  mechanism: string;
  module: string;
  pin: string;
  slot: number;

  constructor(args: Pkcs11Access){
    const {modulePath: module, pin, slot} = args;

    this.module = module;
    this.pin = pin;
    this.slot = slot;
    this.mechanism = HSM_DEFAULT_MECHANISM;
  }

  connect(){

  }
  
  getFlags(operation: Pkcs11Access.operation): Array<string>{
    const args: Array<string> = [];
    const slotId = this.slot.toString();
    
    args.push('--module', this.module);     // Set the module (pkcs11 library) to use
    
    args.push('-l','-p',this.pin);    // Set login and pin flags
    
    args.push('--slot-index', slotId);       // Set the slotId
    
    switch(operation){
      case Pkcs11Access.operation.sign:
        args.push('-s');                      // Set "sign" flag
        args.push('-m', this.mechanism);      // Set the signing mechanism
        args.push('-f','openssl');            // Set the signature format to use
        args.push('-i', SIGN_RAW_DATA_FILE);  // Set the temp file that will store the data to be signed
        args.push('-o', SIGN_SIGNATURE_FILE); // Set the signature file to temporarily store the signature
        break;
      case Pkcs11Access.operation.verify:
        args.push('--verify');
        args.push('-m',this.mechanism);
        args.push('-i', VERIFY_RAW_DATA_FILE);
        args.push('--signature-file', VERIFY_SIGNATURE_FILE);
        break;                       
        case Pkcs11Access.operation.getObject:
        args.push('-r');
        args.push('--type', HSM_DEFAULT_OBJECT_TYPE);
        
        break;
    }

    return args;
  }

  getObjectAsString(label: string, type: string): string {
    throw new Error("Method not implemented.");
  }
  signData(label: string, data: string): string {

    const args: Array<string> = [];
    args.push('--label', label);       // Set the label of the private key object 

    throw new Error("Method not implemented.");
  }
  verify(data: string, signature: string): boolean {
    throw new Error("Method not implemented.");
  }

}