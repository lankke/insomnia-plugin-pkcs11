import { Pkcs11UtilsDto } from "../dto/pkcs11-utils-dto";
import { existsSync, openSync, writeFileSync, readFileSync, unlinkSync, closeSync} from 'fs';
import { spawnSync } from "child_process";
import { HSM_DEFAULT_MECHANISM } from '../../constants';
import { Pkcs11Tool } from "../dto/pkcs11-tool-dto";


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
    var signature = "";
    var tempFilePath = "./temp.txt";
    var tempSignatureFilePath = "./sig.der";
    
    if(data.length < 1) throw "Invalid data given to sign function";

    try {
      const fd = openSync(tempFilePath,'w+');
      const fd2 = openSync(tempSignatureFilePath,'w+');
      const slotId = this.slotId.toString();
      writeFileSync(fd, data);

      var args = [];
      args = ["--module", this.module, ]
      args.push('--module', this.module);     // Set the module (pkcs11 library) to use
      args.push('-s');                        // Set "sign" flag
      args.push('-l','-p',this.pinNumber);    // Set login and pin flags
      args.push('--slot-index', slotId);       // Set the slotId
      args.push('--label', label);                 // Set the label of the private key object 
      args.push('-m', this.mechanism);        // Set the signing mechanism
      args.push('-f','openssl');              // Set the signature format to use
      args.push('-i', tempFilePath);          // Set the temp file that will store the data to be signed
      args.push('-o', tempSignatureFilePath); // Set the signature file to temporarily store the signature


      const {  error } = spawnSync('pkcs11-tool', args);
      
      if(error) throw error.message.toString();

      const sigData = readFileSync(fd2);

      if(sigData.length < 1) throw "cannot fetch signature data";

      const sigBuf = Buffer.from(sigData);

      signature = sigBuf.toString('base64');

      closeSync(fd);
      closeSync(fd2);
      
    } catch (error) {
      console.error("There was an error!",error);
    }finally{
      // Delete the temp files
      if(existsSync(tempFilePath)){        
        unlinkSync(tempFilePath);
      }

      if(existsSync(tempSignatureFilePath)){
        unlinkSync(tempSignatureFilePath);
      }
    }
    return signature;
  }

  verify(data: string, signature: string): boolean {
    return false;
  }

}