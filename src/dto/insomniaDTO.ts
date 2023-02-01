
interface TemplateTag {
  name: string,
  displayName: string,
  disablePreview?: () => boolean,
  description?: string,
  deprecated?: boolean,
  liveDisplayName?: (args: any) => string,
  validate?: (value: any) => string,
  priority?: number,
  args: Array<TemplateTagArg>,
  actions?: Array<TemplateTagAction>,
  run?: TemplateTagAction
}

interface TemplateTagArg {
  displayName: string,
  description?: string,
  defaultValue: string | number | boolean,
  type: 'string' | 'number' | 'enum' | 'model' | 'boolean',
  
  // Only type == 'string'
  placeholder?: string,

  // Only type == 'model'
  modelType?: string,

  // Only type == 'enum'
  options?: Array<TemplateTagArgOption>
}

interface TemplateTagArgOption {
  displayName: string,
  value: string,
  description?: string,
  placeholder?: string
}

interface TemplateTagAction {
  name: string,
  icon?: string,
  run?: (...args: unknown[]) => Promise<void|number>
}