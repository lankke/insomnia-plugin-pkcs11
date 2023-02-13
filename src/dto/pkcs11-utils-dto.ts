
/**
 * Interface Pkcs11Utils
 * 
 * Description: Collection of utility functions for Cryptoki interactions
 */
export interface Pkcs11UtilsDto{

  /**
   * getObjectAsSting
   * 
   * Description: Retrieve Pkcs11 object from a USB HSM token
   * 
   * @param slotId - Slot ID number
   * @param label - The label of the object to be retrieved
   * @param type - Type of object to retrieve (certificate | publicKey)
   */
  getObjectAsString(label: string, type: string):string;
  
  /**
   * signData
   * @param label - Label of the private key object in the token
   * @param data - String of data to sign
   */
  signData(label: string, data: string): string;

  /**
   * @param label - Label of the private key object in the token
   * @param data - Original data that was signed
   * @param signature - The signature
   */
  verify(label:string, data:string, signature: string):boolean;
}



