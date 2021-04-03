const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const JSZip = require('jszip')

require('dotenv').config()

const ROUTE = path.join(process.env.ROUTE, process.env.MOD)
const IGNORE = new Set(['.git', '.gitignore', '.vscode'])

function pack (files, folders = [process.env.MOD], zip = new JSZip()) {
  const currZip = zip.folder(folders[folders.length - 1])
  const currRoute = path.join('..', 'factorio', ...folders)

  for (const f of files) {
    if (!IGNORE.has(f)) {
      console.log(`Zipping: ${f}`)
      const stat = fs.statSync(path.join(currRoute, f))

      if (stat.isDirectory()) {
        pack(fs.readdirSync(path.join(currRoute, f)), folders.concat(f), currZip)
      } else {
        currZip.file(f, fs.readFileSync(path.join(currRoute, f), 'utf-8'))
      }
    }
  }

  return currZip
}

Promise.all([
  fsp.readdir(ROUTE),
  fsp.readFile(path.join(ROUTE, 'info.json'))
])
  .then(([files, jsonBuffer]) => [pack(files), JSON.parse(jsonBuffer)])
  .then(([zip, { name, version }]) =>
    Promise.all([zip.generateAsync({ type: 'nodebuffer' }), `${name}_${version}.zip`]))
  .then(([buffer, modName]) => fsp.writeFile(path.join(process.env.DEST, modName), buffer))
  .then(() => console.log('Mod Zip Written'))
  .catch(console.error)
