import * as pkcs11js from 'pkcs11js';

const randomIntTemplateTag: TemplateTag = {
    name: 'randomInteger',
    displayName: 'Random Integer',
    description: 'Generate a random integer.',
    priority: 1,
    args: [
        {
            displayName: 'Minimum',
            description: 'Minimum potential value',
            type: 'number',
            defaultValue: 0
        }, 
        {
            displayName: 'Maximum',
            description: 'Maximum potential value',
            type: 'number',
            defaultValue: 100
        }
    ],
    run: async (context: any, min: number, max: number) =>{
        return Math.round(min + Math.random() * (max - min));
    }
}

const initializePkcs11: TemplateTag = {
    name:'initializePkcs11',
    displayName: 'Initialize Pkcs11',
    description: '... Just a placeholder for getting pkcs11 working',
    priority: 2,
    args: [
        {
            displayName: 'Label',
            description: 'Label of the object',
            type: 'string',
            defaultValue: 'a1'
        }
    ],
    run: async (context: any, label: string) =>{

        const pkcs11 = new pkcs11js.PKCS11();
        pkcs11.load()

        return label;
    }
}

/**
 * Example template tag that generates a random number 
 * between a user-provided MIN and MAX
 */
module.exports.templateTags = [randomIntTemplateTag];