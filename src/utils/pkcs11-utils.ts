import { Pkcs11UtilsDto } from "../dto/pkcs11-utils-dto";
import { existsSync, openSync, writeFileSync, readFileSync, unlinkSync, closeSync} from 'fs';
import { spawnSync } from "child_process";


export class Pkcs11Utils implements Pkcs11UtilsDto{
  module: string;
  slotId: number;
  pinNumber: string;

  constructor(module: string, slotId: number, pinNumber: string){
    this.module = module;
    this.slotId = slotId;
    this.pinNumber = pinNumber;
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
  signData(data: string): string {
    var signature = "";
    var tempFilePath = "./temp.txt";
    var tempSignatureFilePath = "./sig.der";

    if(data.length < 1) throw "Invalid data given to sign function";

    try {
      const fd = openSync(tempFilePath,'w+');
      const fd2 = openSync(tempSignatureFilePath,'w+');
      writeFileSync(fd, data);

      const args = ['-s','-p','123456','-f','openssl','-i', tempFilePath,'-o', tempSignatureFilePath];

      spawnSync('pkcs11-tool', args);
      
      const sigData = readFileSync(fd2);

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

      // if(existsSync(tempSignatureFilePath)){
      //   unlinkSync(tempSignatureFilePath);
      // }
    }
    return signature;
  }

  verify(data: string, signature: string): boolean {
    return false;
  }

}