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

var generateRandomInt : TemplateTagAction = {
    name: "Generate Number",
    run: async (context: any, min: number, max: number) =>{
        return Math.round(min + Math.random() * (max - min));
    }
}

/**
 * Example template tag that generates a random number 
 * between a user-provided MIN and MAX
 */
module.exports.templateTags = [randomIntTemplateTag];