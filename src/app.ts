/**
 * Example template tag that generates a random number 
 * between a user-provided MIN and MAX
 */
module.exports.templateTags = [{
  name: 'randomInteger',
  displayName: 'Random Integer',
  description: 'Generate a random integer.',
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
  async run (context: any, min: number, max: number) {
      return Math.round(min + Math.random() * (max - min));
  }
}];