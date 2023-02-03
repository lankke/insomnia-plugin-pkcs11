import { PKCS11 } from "pkcs11js";

export function initToken(): void{
  try {
    var pkcs11 = new PKCS11();
    pkcs11.load('/usr/lib/opensc-pkcs11.so');

    pkcs11.C_Initialize();

    pkcs11.C_Finalize();

  } catch (error) {
    console.error("caught error in initToken");
    throw error;
  } finally{
    console.log("No issue here!");
  }
}