import { App, Plugin, moment, FileView, PluginSettingTab, Setting } from 'obsidian';

class NotesDaterSettingTab extends PluginSettingTab {
  plugin: NotesDaterPlugin;

  constructor(app: App, plugin: NotesDaterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Date format")
      .setDesc("Default date format")
      .addText((text) =>
        text
          .setPlaceholder("DD MMM YYYY")
          .setValue(this.plugin.settings.dateFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl)
    .setName("Created date property")
    .setDesc("Leave empty to use filesystem data")
    .addText((text) =>
      text
        .setValue(this.plugin.settings.createdDateFrontmatterProperty)
        .onChange(async (value) => {
          this.plugin.settings.createdDateFrontmatterProperty = value;
          await this.plugin.saveSettings();
        })
    );
    new Setting(containerEl)
    .setName("Modified date property")
    .setDesc("Leave empty to use filesystem data")
    .addText((text) =>
      text
        .setValue(this.plugin.settings.updatedDateFrontmatterProperty)
        .onChange(async (value) => {
          this.plugin.settings.updatedDateFrontmatterProperty = value;
          await this.plugin.saveSettings();
        })
    );
  }
}

interface NotesDaterPluginSettings {
  dateFormat: string;
  createdDateFrontmatterProperty: string;
  updatedDateFrontmatterProperty: string;
}

const DEFAULT_SETTINGS: Partial<NotesDaterPluginSettings> = {
  dateFormat: "DD MMM YYYY",
};

export default class NotesDaterPlugin extends Plugin {
  settings: NotesDaterPluginSettings;
  

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new NotesDaterSettingTab(this.app, this));
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
      const createdDateFrontmatter = app.metadataCache.getCache(activeFile.path)?.frontmatter?.[this.settings.createdDateFrontmatterProperty]
      const updatedDateFrontmatter = app.metadataCache.getCache(activeFile.path)?.frontmatter?.[this.settings.updatedDateFrontmatterProperty]
      const createdDate = moment(createdDateFrontmatter || stats.ctime).format(this.settings.dateFormat);
      const updatedDate = moment(updatedDateFrontmatter || stats.mtime).format(this.settings.dateFormat);
      statusBarCreatedOn.setText(`Created on: ${createdDate}`);
      statusBarUpdatedOn.setText(`Updated on: ${updatedDate}`);
    }
  }
}