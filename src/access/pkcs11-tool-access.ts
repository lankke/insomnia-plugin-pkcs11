import { Pkcs11UtilsDto } from "../dto/pkcs11-utils-dto";
import { Pkcs11Access } from "../dto/pkcs11-access-dto";
import { SIGN_SIGNATURE_FILE, SIGN_RAW_DATA_FILE, HSM_DEFAULT_OBJECT_TYPE, HSM_DEFAULT_MECHANISM, VERIFY_SIGNATURE_FILE, VERIFY_RAW_DATA_FILE, HSM_DEFAULT_SIGNATURE_FORMAT } from "../../constants";
import { closeSync, existsSync, openSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import { spawnSync } from "child_process";

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

  private deleteTempFiles(files: Array<string>): void{
    files.forEach(f=>{
      if(existsSync(f)) unlinkSync(f);
      else throw new Error(`Could not delete ${f}... it does not exists`);
    });
  }
  
  getFlags(operation: Pkcs11Access.operation): Array<string>{
    const args: Array<string> = [];
    const slotId = this.slot.toString();
    
    args.push('--module', this.module);     // Set the module (pkcs11 library) to use
    
    args.push('-l','-p',this.pin);    // Set login and pin flags
    
    args.push('--slot-index', slotId);       // Set the slotId
    
    switch(operation){
      case Pkcs11Access.operation.sign:
        args.push('-s');                              // Set "sign" flag
        args.push('-m', this.mechanism);              // Set the signing mechanism
        args.push('-f', HSM_DEFAULT_SIGNATURE_FORMAT);// Set the signature format to use
        args.push('-i', SIGN_RAW_DATA_FILE);          // Set the temp file that will store the data to be signed
        args.push('-o', SIGN_SIGNATURE_FILE);         // Set the signature file to temporarily store the signature
        break;
      case Pkcs11Access.operation.verify:
        args.push('--verify');
        args.push('-m',this.mechanism);
        args.push('-i', VERIFY_RAW_DATA_FILE);
        args.push('--signature-file', VERIFY_SIGNATURE_FILE);
        args.push('--signature-format', HSM_DEFAULT_SIGNATURE_FORMAT);
        break;                       
        case Pkcs11Access.operation.getObject:
        args.push('-r');        
        break;
    }

    return args;
  }

  getObjectAsString(label: string, type: string): string {
    throw new Error("Method not implemented.");
  }
  signData(label: string, data: string): string {

    const args = this.getFlags(Pkcs11Access.operation.sign);
    args.push('--label', label);       // Set the label of the private key object 

    // Open a file to write the data to
    const rawDataFile = openSync(SIGN_RAW_DATA_FILE,'w+');
    writeFileSync(rawDataFile, data);

    // Create the file for the signature
    const signatureFile = openSync(SIGN_SIGNATURE_FILE,'w+');
    
    // Run the pkcs11-tool with the correct args
    const { error } = spawnSync('pkcs11-tool', args);

    if(error) throw new Error("Method not implemented.");

    // read the signature buffer from the file
    const sigBuf = readFileSync(signatureFile);

    if(sigBuf.length < 1) throw Error("Empty Signature");

    closeSync(rawDataFile);
    closeSync(signatureFile);

    this.deleteTempFiles([SIGN_RAW_DATA_FILE, SIGN_SIGNATURE_FILE]);

    return sigBuf.toString('base64');
  }
  verify(label: string, data: string, signature: string): boolean {
    
    [label,data,signature].find((arg)=>{
      if(!arg.length) throw new Error(`${arg} is empty`);
    });

    const args = this.getFlags(Pkcs11Access.operation.verify);
    args.push('--label',label);

    const signatureFile = openSync(VERIFY_SIGNATURE_FILE,'w+');
    const rawData = openSync(VERIFY_RAW_DATA_FILE,'w+');

    const sigBuf = Buffer.from(signature, 'base64');

    writeFileSync(rawData, data);
    writeFileSync(signatureFile, sigBuf);

    const { stdout, signal, status } = spawnSync('pkcs11-tool', args);
    
    closeSync(rawData);
    closeSync(signatureFile);

    this.deleteTempFiles([VERIFY_RAW_DATA_FILE, VERIFY_SIGNATURE_FILE]);

    if(signal == null && stdout.toString('utf8').match("Signature is valid")){
      return true;
    }
    return false;
  }
}