import { Plugin } from 'obsidian';
import * as YAML from 'js-yaml';
import * as fs from 'fs/promises';
import { TFile } from 'obsidian';

function formatDate(date: string) {
  const dateObject = new Date(date);
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  
  return `${day}-${month}-${year}`;
}

export default class NotesDaterPlugin extends Plugin {


  async onload() {
    console.log('Loading Notes Dater plugin');

    const statusBarFileName = this.addStatusBarItem();

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', () => {
        const activeFileName = this.logActiveFileName();
        if (activeFileName) {
          statusBarFileName.setText(`Active note: ${activeFileName}`);
        }
      })
    );
      
  }

  async onunload() {
    console.log('Unloading Notes Dater plugin');
  }


  logActiveFileName() {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf) {
      const activeFile = activeLeaf.view.file;
      if (activeFile) {
        const activeFileName = activeFile.basename;
        return activeFileName;
      }
    }
    return null;
  }
  
}
