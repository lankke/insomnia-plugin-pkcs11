export namespace Pkcs11Tool{
  type Password = string;
  type Filename = string;
  type Label = string;
  export type ModuleFlag = `--module`;
  export type PasswordFlag = `-p ${Password}`;
  export type FormatFlag = '-f openssl' | '-f rs';
  export type SignFlag = '-s'
  export type FileFlag = `-i ${Filename}` | `-o ${Filename}`;
  export type LabelFlag = `-d ${Label}`;
  export type Flag = ModuleFlag | SignFlag | PasswordFlag | FormatFlag | LabelFlag;
  export enum FunctionType {
    sign,
    read,
    write
  }

  export interface Dto{
     args: Array<Flag>,
     cmd: 'pkcs11-tool'
  }

  
  export interface Pkcs11ToolCLICmds {
    getFunction(args: Flag[]):FunctionType;
    pkcs11Tool(input: Dto):string;
  }

}
