# Obsidian Notes dater 

An [obsidian.md](https://obsidian.md) plugin that adds created_on and updated_on metadata to the top of all Obsidian notes, even old notes that were created before the plugin was installed. It's not quite ready for use yet. 

If you have any feedback or feature requests please open an issue or email me to let me know. 

## Features 
- [x] Adds created_on and updated_on metadata to the top of existing notes 
- [x] Adds created_on and updated_on metadata to the top of newly created notes
- [ ] Updates updated_on metadata when a note is updated
- [ ] Include command in palette that allows users to remove the created_on and updated_on metadata from the top of all notes

## Current issues
- [ ] Adding the frontmatter to the files changes the last updated time. This is a problem because it means that the plugin will keep updating the last updated time.
- [ ] If frontmatter has no other content (after removing notes-dater stuff), remove frontmatter entirely

## Things I might add in the future
- [ ] Include settings to allow users to choose how dates are formatted


## Installing and running the plugin in devlopment mode

- Clone this repo into the `/path/to/your/vault/.obsidian/plugins directory`
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.
- Enable plugins in Obsidian settings
- Enable Note Dater in the Community Plugins tab

## Manually installing the plugin

- Copy over `main.js` and `manifest.json` to your vault `/path/to/your/vault/.obsidian/plugins/your-plugin-id/`.
- Enable plugins in Obsidian settings
- Enable Note Dater in the Community Plugins tab

## Funding URL


## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contributing
Pull requests are welcome.

## Author 
[Paul Treanor](https://paultreanor.com)

## Development Notes

**Notes for myself, because I forget...**
- The plugin development environment is inside the vault, in the `.obsidian/plugins` directory. So the same as an actual installed plugin.
- The `manifest.json` and `main.ts` files are the plugins, basically. 
- When you make a change, reload the plugin by toggling it off and on again in the Community Plugins tab.

**API Notes** 
- `Plugin` is a class. 
- `onload()` runs when user starts the plugin
- `onunload()` runs when user stops the plugin

**Commands** 
- Users call commands from the command palette or with hotkeys
- It makes sense for notes-dater to run from the command palette

**Settings**
- I'm going to need to allow the user to interact with settings

**Vault** 
- This is the main part of the API I'm going to need to interact with

**Useful links**

- [Obsidian Plugin docs](https://marcus.se.net/obsidian-plugin-docs)