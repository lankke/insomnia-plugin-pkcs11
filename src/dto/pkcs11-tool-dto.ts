export namespace Pkcs11Tool{
  type Password = string;
  type Filename = string;
  export type PasswordFlag = `-p ${Password}`;
  export type FormatFlag = '-f openssl' | '-f rs';
  export type SignFlag = '-s'
  export type FileFlag = `-i ${Filename}` | `-o ${Filename}`
  export type Flag = SignFlag | PasswordFlag | FormatFlag
  export enum FunctionType {
    sign,
    read,
    write
  }

  export interface Dto{
     args: Array<Flag>,
     cmd: 'pkcs11-tool'
  }
}
