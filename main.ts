import { Plugin, moment, FileView } from 'obsidian';

export default class NotesDaterPlugin extends Plugin {
  async onload() {

    const statusBarCreatedOn = this.addStatusBarItem();
    const statusBarUpdatedOn = this.addStatusBarItem();

    // Set initial values
    this.setStatusBarDateValues(statusBarCreatedOn, statusBarUpdatedOn);


    this.registerEvent(
      this.app.workspace.on('active-leaf-change', async () => {
        this.setStatusBarDateValues(statusBarCreatedOn, statusBarUpdatedOn);
      })
    );
  }

  async onunload() {
  }

  setStatusBarDateValues(statusBarCreatedOn, statusBarUpdatedOn) {
    const activeView = this.app.workspace.getActiveViewOfType(FileView);
    const activeFile = this.app.workspace.getActiveFile();
    if (activeView && activeFile) {
      const stats = activeFile?.stat
      const createdDate = moment(stats.ctime).format('DD MMM YYYY');
      const updatedDate = moment(stats.mtime).format('DD MMM YYYY');
      statusBarCreatedOn.setText(`Created on: ${createdDate}`);
      statusBarUpdatedOn.setText(`Updated on: ${updatedDate}`);
    }
  }

}
