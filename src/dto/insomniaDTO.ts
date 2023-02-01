
interface TemplateTag {

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
  run?: (context: any) => Promise<void>
}