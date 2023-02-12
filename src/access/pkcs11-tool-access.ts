import { Pkcs11UtilsDto } from "../dto/pkcs11-utils-dto";
import { Pkcs11Access } from "../dto/pkcs11-access-dto";

export class Pkcs11ToolAccess implements Pkcs11UtilsDto{
  modulePath: string;
  pin: string;
  slot: number;

  constructor(args: Pkcs11Access){
    const {modulePath: module, pin, slot} = args;

    this.modulePath = module;
    this.pin = pin;
    this.slot = slot;
  }

  getObjectAsString(label: string, type: string): string {
    throw new Error("Method not implemented.");
  }
  signData(data: string): string {
    throw new Error("Method not implemented.");
  }
  verify(data: string, signature: string): boolean {
    throw new Error("Method not implemented.");
  }

}