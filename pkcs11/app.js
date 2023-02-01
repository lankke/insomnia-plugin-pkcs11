var pkcs11 = require('pkcs11js');

const pkcs11ObjectType = {
    Certificate: Symbol("certificate"),
    PublicKey: Symbol("publicKey")
}

const OPENSC_PKCS11_LIB_PATH = "/usr/lib/opensc-pkcs11.so";

function getObjectTemplate(label){
    
    var certificateTemplate = [
        { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_CERTIFICATE },
        { type: pkcs11js.CKA_TOKEN, value: false },
        { type: pkcs11js.CKA_LABEL, value: label }
    ];

    return certificateTemplate;
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
        
        var isInitialized = false;
        var pkcs11 = new pkcs11js.PKCS11();
        var rv;

        try {
            pkcs11.load(OPENSC_PKCS11_LIB_PATH);
            pkcs11.C_Initialize();

            // Getting list of slots
            var slots = pkcs11.C_GetSlotList(true);
            var slot = slots[0];

            // Getting info about slot
            var slot_info = pkcs11.C_GetSlotInfo(slot);
            // Getting info about token
            var token_info = pkcs11.C_GetTokenInfo(slot);

            // Getting info about Mechanism
            var mechs = pkcs11.C_GetMechanismList(slot);
            var mech_info = pkcs11.C_GetMechanismInfo(slot, mechs[0]);

            var session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);

            // Getting info about Session
            var info = pkcs11.C_GetSessionInfo(session);
            pkcs11.C_Login(session, 1, pinNumber);

            var certTemplate = getObjectTemplate(label);

            pkcs11.C_FindObjectsInit(session, certTemplate);

            var hObject = pkcs11.C_FindObjects(session);

            if(hObject){
                console.log("Object Found!");
                var attr = pkcs11.C_GetAttributeValue(session, hObject,[
                    {type: pkcs11.CKA_VALUE }
                ]);

                console.log("attr = ",attr);

            }else{
                console.error("No object found!");
            }

            pkcs11.C_FindObjectsFinal(session);
            
            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);
            
        } catch (error) {
            console.error("Exception Caught", error);
        } finally{
            if(isInitialized){
                pkcs11.C_Finalize();
            }
        }

        return "Here we go";
    }

}];

