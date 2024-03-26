import type { Plugin } from 'vite'
import path from 'path'
import {Chalk} from 'chalk'
import { writeFile } from 'fs/promises'
const chalk = new Chalk()

type PluginConfig = {}

const cwd = process.cwd()
const node_modules_path = path.resolve(cwd, 'node_modules') 
const sveltekit_generated_path = path.resolve(cwd, '.svelte-kit')

export const plugin = (config: PluginConfig = {}): Plugin => {
  let mappedFunctions:Record<string, string> = {}  
  return {
    name: 'vite-plugin-svelte-server-actions',
    async transform(code, id) {
      if(id.startsWith(node_modules_path) || id.startsWith(sveltekit_generated_path)){
        return null
      }
      if(!id.endsWith('.actions.ts') && !id.endsWith('.actions')){
        return null
      }
      console.log('Transforming id', id)
      console.log('Transforming code', code)
      const parsedCode = this.parse(code)
      console.log('Parsed code', parsedCode)
      const allFunctions = parsedCode.body.filter((node) => node.type === 'ExportNamedDeclaration' && node?.declaration?.type === 'FunctionDeclaration')
      console.log('All functions', allFunctions)
      let result = 'export const mapper = {'
      for (const node of allFunctions){
          if(node.type === 'ExportNamedDeclaration' && node.declaration?.type === 'FunctionDeclaration'){
            if(!node.declaration.async){
              console.error(chalk.red('Server actions must be async'))
              this.error('Server actions must be async')
            }
            if(node.declaration?.id?.type !== 'Identifier'){
              console.error(chalk.red('Server actions must be named'))
              this.error('Server actions must be named')
            }
  
            const name = node.declaration.id.name
            const newFunction = `export async function ${name}(...props){
              const res = await fetch('/_server_actions/${name}', {
                method:'POST',
                credentials:'same-origin',
                body:JSON.stringify(props)
              })
  
              if(!res.ok){
                alert('Error calling server action')
              }
              return await res.json()
            }`
            const {start, end} = node
  
            const oldCode = code.slice(start, end)
  
            const firstHalf = code.slice(0, start)
            const secondHalf = code.slice(end)
            code = `${firstHalf}${newFunction}${secondHalf}`
            mappedFunctions[name] = oldCode
            console.log('Mapped functions from transformer', mappedFunctions)
            
            for (const [key, value] of Object.entries(mappedFunctions)){
              result += `${key}:${value.replace('export', '')},`
            }
            
          }
          result += '}'
          console.log('result >>>:', result)
          await writeFile(path.resolve(cwd, 'src/hookMapper.ts'), result)
      }
      return {
        code
      }
    },
    buildEnd(){
      console.log('Mapped functions', mappedFunctions)
      mappedFunctions = {}
      console.log(chalk.green('Build started'))
    },
  }
}