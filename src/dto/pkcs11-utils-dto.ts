
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
   * 
   * @param data - String of data to sign
   */
  signData(data: string): string;

  verify(data:string, signature: string):boolean;
}



