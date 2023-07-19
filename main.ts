import { Plugin } from 'obsidian';
import * as YAML from 'js-yaml';
import * as fs from 'fs/promises';
import { TFile } from 'obsidian';
import { format } from 'path';

function formatDate(date: string) {
  const dateObject = new Date(date);
  const day = dateObject.getDate();
  const month = dateObject.getMonth();
  const year = dateObject.getFullYear();

  // Array of month names
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];

  // Convert day number to ordinal
  let dayOrdinal;
  if (day % 10 === 1 && day !== 11) {
    dayOrdinal = day + "st";
  } else if (day % 10 === 2 && day !== 12) {
    dayOrdinal = day + "nd";
  } else if (day % 10 === 3 && day !== 13) {
    dayOrdinal = day + "rd";
  } else {
    dayOrdinal = day + "th";
  }

  return `${dayOrdinal} ${monthNames[month]} ${year}`;
}


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
