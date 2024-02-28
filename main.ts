import { App, Plugin, moment, FileView, PluginSettingTab, Setting, TFile } from 'obsidian';

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
      .setName("Store date values in note properties")
      .setDesc("This means the plugin will record updates to files in the file itself, rather than relying on file metadata. Recommended for Linux users.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useFixedProperties)
          .onChange(async (value) => {
            this.plugin.settings.useFixedProperties = value;
            await this.plugin.saveSettings();
          })
      );
  }
}

interface NotesDaterPluginSettings {
  dateFormat: string;
  createdDateFrontmatterProperty: string;
  updatedDateFrontmatterProperty: string;
  useFixedProperties: boolean
}

const DEFAULT_SETTINGS: Partial<NotesDaterPluginSettings> = {
  dateFormat: "DD MMM YYYY",
  createdDateFrontmatterProperty: "",
  updatedDateFrontmatterProperty: "",
  useFixedProperties: false,
};

export default class NotesDaterPlugin extends Plugin {
  settings: NotesDaterPluginSettings;
  fileUpdateLock: boolean; // Prevents the plugin updating frontmatter properties from triggering event listener - if true, then updates are allowed 
  

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new NotesDaterSettingTab(this.app, this));
    this.registerEventListeners();
    this.fileUpdateLock = true
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

  registerEventListeners() {
    // Listen for file changes that might require updating the frontmatter
    this.registerEvent(this.app.vault.on('modify', async (file) => {
      if (!this.fileUpdateLock) return; // Skip if the plugin is updating a file

      const activeFile = this.app.workspace.getActiveFile();

      // Ensure the modified file is a markdown file
      if (file instanceof TFile && file.extension === 'md' && file.path === activeFile?.path) {
        await this.updateNoteFrontmatter(file);
      }
    }));
  }

  async updateNoteFrontmatter(file: TFile) {
    // set fileUpdateLock to false to prevent the event listener from triggering a file update event listener infinite loop
    this.fileUpdateLock = false;

    const fileContent = await this.app.vault.read(file);
    const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter || {};
  
    if (this.settings.useFixedProperties) {
      const createdDate = frontmatter["Created_on"] || moment(file.stat.ctime).format(this.settings.dateFormat);
      frontmatter["Created_on"] = createdDate;
  
      const updatedDate = moment().format(this.settings.dateFormat); // Use current date for updatedDate
      frontmatter["Updated_on"] = updatedDate;
    }
  
    // Reconstruct the frontmatter and file content, then write back to the file
    const newFrontmatterString = this.constructFrontmatterString(frontmatter);
    const newFileContent = newFrontmatterString + '\n' + this.stripFrontmatter(fileContent);
    await this.app.vault.modify(file, newFileContent);

    // Reset lock to allow event listener to see updates again
    this.fileUpdateLock = true;
  }
  
  constructFrontmatterString(frontmatter: any): string {
    // Convert the frontmatter object back into a YAML string
    return '---\n' + Object.entries(frontmatter).map(([key, value]) => `${key}: ${value}`).join('\n') + '\n---';
  }
  
  stripFrontmatter(fileContent: string): string {
    // Remove the existing frontmatter from the file content
    return fileContent.replace(/---[\s\S]+?---/, '').trim();
  }

  async onunload() {
  }

  isValidDate(dateFrontmatter) { 
    return moment(dateFrontmatter).isValid() && dateFrontmatter !== undefined;
  }

  setStatusBarDateValues(statusBarCreatedOn, statusBarUpdatedOn) {
    const activeView = this.app.workspace.getActiveViewOfType(FileView);
    const activeFile = this.app.workspace.getActiveFile();
    if (activeView && activeFile) {
      const stats = activeFile?.stat
      const createdDateFrontmatter = app.metadataCache.getCache(activeFile.path)?.frontmatter?.[this.settings.createdDateFrontmatterProperty]
      const updatedDateFrontmatter = app.metadataCache.getCache(activeFile.path)?.frontmatter?.[this.settings.updatedDateFrontmatterProperty]
      const createdDate = moment(this.isValidDate(createdDateFrontmatter) ? createdDateFrontmatter : stats.ctime).format(this.settings.dateFormat);
      const updatedDate = moment(this.isValidDate(updatedDateFrontmatter) ? updatedDateFrontmatter : stats.mtime).format(this.settings.dateFormat);
      statusBarCreatedOn.setText(`Created on: ${createdDate}`);
      statusBarUpdatedOn.setText(`Updated on: ${updatedDate}`);
    }
  }
}