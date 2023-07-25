import { Plugin, moment, FileView } from 'obsidian';

export default class NotesDaterPlugin extends Plugin {
  async onload() {

    const statusBarCreatedOn = this.addStatusBarItem();
    const statusBarUpdatedOn = this.addStatusBarItem();

    this.registerEvent(
      this.app.workspace.on('active-leaf-change', async () => {
        const activeView = this.app.workspace.getActiveViewOfType(FileView);
        const activeFile = this.app.workspace.getActiveFile();
        if (activeView && activeFile) {
          const stats = activeFile?.stat
          const createdDate = moment(stats.ctime).format('do MMM YYYY');
          const updatedDate = moment(stats.mtime).format('do MMM YYYY');
          statusBarCreatedOn.setText(`Created on: ${createdDate}`);
          statusBarUpdatedOn.setText(`Updated on: ${updatedDate}`);
        }
      })
    );
  }

  async onunload() {
    console.log('Unloading Notes Dater plugin');
  }
}
