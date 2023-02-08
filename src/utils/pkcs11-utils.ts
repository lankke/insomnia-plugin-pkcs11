import { Pkcs11UtilsDto } from "../dto/pkcs11-utils-dto";
import { existsSync, openSync, writeFileSync, unlink, readFileSync} from 'fs';
import { spawn, spawnSync } from "child_process";


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

  signData(data: string): string {
    var signature = "";
    var tempFilePath = "./temp.txt";
    var tempSignatureFilePath = "./sig.txt";

    try {
      const fd = openSync(tempFilePath,'w+');
      writeFileSync(fd, data);

      const args = ['-s','-p','123456','-i', tempFilePath,'-o', tempSignatureFilePath];

      spawnSync('pkcs11-tool', args);
      
      const fd2 = openSync(tempSignatureFilePath,'r');
      const sigData = readFileSync(fd2);

      const sigBuf = Buffer.from(sigData);

      signature = sigBuf.toString('base64');

        
    


    } catch (error) {
      console.error("There was an error!",error);
    }finally{
      if(existsSync(tempFilePath)){
        // unlink(tempFilePath,()=>{
        //   console.log(tempFilePath, ' deleted');
        // });
      }

      if(existsSync(tempSignatureFilePath)){
        // unlink(tempSignatureFilePath, ()=>{
        //   console.log(tempSignatureFilePath, ' deleted');
        // })
      }
    }
    return signature;
  }

  verify(data: string, signature: string): boolean {
    return false;
  }

}