# Packtorio
A simple packing script used to take my factorio mod and pack it into a zip that gets placed in the mods folder

This tool is built mostly for my use, however I can make it more stream lined if more people have a desire to actively use this tool.

## How To

- Clone repo
- `cd` into repo
- Run `npm i`
- Create a `.env` file
  - Add a `DEST` export, this is WHERE you want the packaged mod to go (usually the factorio mods folder)
  - Add a `ROUTE` export, this is where your source code for the mod you are working on lives
  - Add a `MOD` export, this is the name of the folder your source code lives in

It's a bit complex, but I may just make this into a CLI tool in the future to make it easier to use, this was mostly an experiment and to make mod packaging easier
