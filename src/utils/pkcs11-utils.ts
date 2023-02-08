import { Pkcs11UtilsDto } from "../dto/pkcs11-utils-dto";


export class Pkcs11Utils implements Pkcs11UtilsDto{

  getObjectAsString(label: string, type: string): string {
    return "";
  }

  signData(data: string): string {
    return "";
  }

  verify(data: string, signature: string): boolean {
    return false;
  }

}