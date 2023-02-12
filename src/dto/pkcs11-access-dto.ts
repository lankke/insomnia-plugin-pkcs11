export interface Pkcs11Access{
  modulePath: string,
  pin?: string,
  slot?: number
}

export namespace Pkcs11Access{
  export enum operation {
    sign,
    verify,
    getObject
  }
}