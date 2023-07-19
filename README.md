# Obsidian Notes dater 

An [obsidian.md](https://obsidian.md) plugin that adds created_on and updated_on metadata of Obsidian notes to the status bar of Obsidian (bottom of the screen). It works for all notes, even old notes that were created before the plugin was installed. It's not quite ready for use yet. 

Because this app uses the status bar it is not supported in the mobile app. 

If you have any feedback or feature requests please open an issue or email me to let me know. 

## Features 
- [ ] Adds created_on and updated_on metadata of open note to the status bar 
- [ ] Include settings to allow users to toggle what the plugin shows 

## Why the status bar 
My origional plan (and a lot of earlier commits to this project) was to add created_on and updated_on data to the frontmatter at the top of each file. I decided to change my approach because:

1. The plugin literally updated the contents all files when installed, which means that the last updated dates would always be after the plugin was installed. 
2. There was infinate loop problems since the plugin updated files when they were edited, by editing them. 
3. It's a bit intrusive and assumes people don't mind their notes being edited. It's just overkill and not how any other notes app does this. 

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