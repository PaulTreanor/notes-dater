# Obsidian Notes dater 

An [obsidian.md](https://obsidian.md) plugin that adds the date that the active Obsidian file was created on and last updated on to the status bar.

The plugin adds the information highlighted in red in this image:

![Screenshot of plugin in use](screenshot.png)

It works for all files including notes, images, and PDFs. 

If you have any feedback or feature requests please open an issue or email me to let me know. 


## Features 
- [x] Adds Created on and Updated on metadata of open note to the status bar 

## Manually installing the plugin

- Copy over `main.js` and `manifest.json` to your vault `/path/to/your/vault/.obsidian/plugins/your-plugin-id/`.
- Enable plugins in Obsidian settings
- Enable Note Dater in the Community Plugins tab

## Installing and running the plugin in devlopment mode

- Clone this repo into the `/path/to/your/vault/.obsidian/plugins directory`
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.
- Enable plugins in Obsidian settings
- Enable Note Dater in the Community Plugins tab

## Running tests
- `npx vitest`

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Contributing
Pull requests are welcome.

## Author 
[Paul Treanor](https://paultreanor.com)

