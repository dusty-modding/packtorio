const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const JSZip = require('jszip')

require('dotenv').config()

const ROUTE = path.join(process.env.ROUTE, process.env.MOD)
const IGNORE = new Set(['.git', '.gitignore', '.vscode'])

function pack (files, zip, folders = [process.env.MOD]) {
  const currRoute = path.join('..', 'factorio', ...folders)

  for (const f of files) {
    if (!IGNORE.has(f)) {
      const stat = fs.statSync(path.join(currRoute, f))

      if (stat.isDirectory()) {
        console.log('Packing Folder:', f)
        pack(fs.readdirSync(path.join(currRoute, f)), zip, folders.concat(f))
      } else {
        console.log('Zipping:', f)
        zip.file(path.join(...[...folders, f]), fs.readFileSync(path.join(currRoute, f), 'utf-8'))
      }
    }
  }

  return zip
}

const zip = new JSZip()

Promise.all([
  fsp.readdir(ROUTE),
  fsp.readFile(path.join(ROUTE, 'info.json'))
])
  .then(([files, jsonBuffer]) => [pack(files, zip.folder(process.env.MOD)), JSON.parse(jsonBuffer)])
  .then(([zip, { name, version }]) =>
    Promise.all([zip.generateAsync({ type: 'nodebuffer', platform: 'UNIX' }), `${name}_${version}.zip`]))
  .then(([buffer, modName]) => fsp.writeFile(path.join(process.env.DEST, modName), buffer))
  .then(() => console.log('Mod Zip Written'))
  .catch(console.error)
