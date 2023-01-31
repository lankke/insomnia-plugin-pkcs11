const pkcs11ObjectType = {
    Certificate: Symbol("certificate"),
    PublicKey: Symbol("publicKey")
}

module.exports.templateTags = [
{
    name: 'getCertificate',
    displayName: 'Get PKCS11 Certificate',
    args: [
        {
            displayName: 'Slot Id',
            description: 'Id of the Cryptoki Slot you want to query (default: 0)',
            type: 'number',
            defaultValue: 0
        },
        {
            displayName: 'PIN Number',
            description: 'PIN Number to your USB Token',
            type: 'number',
            defaultValue: 0
        },
        {
            displayName: 'PKCS11 Object Type',
            description: 'The type of object you want to fetch from the token (certificate | publicKey)',
            type: 'enum',
            defaultValue: pkcs11ObjectType.Certificate,
            options:[
                {
                    displayName: "X509 Certificate",
                    value: "certificate"
                },
                {
                    displayName: "Public Key",
                    value: "publicKey"
                }
            ]
        }

    ], async run (context, slotId, pinNumber, objectType){
        console.log(slotId,pinNumber,objectType);
        return "Nice";
    }

}];

