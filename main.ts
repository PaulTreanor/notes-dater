import { Plugin } from 'obsidian';
import * as fs from 'fs/promises';
import formatDate from 'formatDate';


export default class NotesDaterPlugin extends Plugin {


  async onload() {
    console.log('Loading Notes Dater plugin');

    const statusBarCreatedOn = this.addStatusBarItem();
    const statusBarUpdatedOn = this.addStatusBarItem();

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', async () => {
        const getActiveFilePath = this.getActiveFilePath();
        if (getActiveFilePath) {
          const stats = await fs.stat(getActiveFilePath);
          const createdDate = formatDate(stats.birthtime.toISOString());
          const updatedDate = formatDate(stats.mtime.toISOString());
          statusBarCreatedOn.setText(`Created on: ${createdDate}`);
          statusBarUpdatedOn.setText(`Updated on: ${updatedDate}`);
        }
      })
    );
      
  }

  async onunload() {
    console.log('Unloading Notes Dater plugin');
  }

  // Returns full file path of the active note/image/file in the current pane
  getActiveFilePath() {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf) {
      const activeFile = activeLeaf.view.file;
      if (activeFile) {
        const fullFilePath = this.app.vault.adapter.getFullPath(activeFile.path);
        return fullFilePath;
      }
    }
    return null;
  }
  
  
}
