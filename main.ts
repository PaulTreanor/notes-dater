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

    this.addCommand({
      id: 'update-metadata',
      name: 'Update frontmatter metadata',
      callback: () => this.updateMetadata(),
		});
		
		this.addCommand({
      id: 'undo-update-metadata',
      name: 'Undo update frontmatter metadata',
      callback: () => this.undoUpdateMetadata(),
    });
    
    // Register vault change event for new files
    // this.registerEvent(this.app.vault.on("create", async (file: TFile) => {
    //   if (file instanceof TFile && file.extension === "md") {
    //       console.log(`New file created: ${file.basename}`);
    //       await this.updateFrontmatter(file);
    //   }
    // }));

    // Register vault change event for modified files
    // this.registerEvent(this.app.vault.on("modify", async (file: TFile) => {
    //     if (file instanceof TFile && file.extension === "md") {
    //         // console.log(`File modified: ${file.basename}`);
    //         await this.updateFrontmatter(file);
    //     }
    // }));
		
  }

  async onunload() {
    console.log('Unloading Notes Dater plugin');
  }

  async updateMetadata() {
      const fileManager = this.app.vault;
      const files = fileManager.getMarkdownFiles();
  
      for (const file of files) {
        try {
          const fileContent = await fileManager.read(file);
          const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
          const match = frontmatterRegex.exec(fileContent);
  
          let frontmatter: any = {};
          let content = fileContent;
  
          if (match) {
            frontmatter = YAML.load(match[1]);
            content = match[2];
          }
  
          const filePath = fileManager.adapter.getFullPath(file.path);
          const stats = await fs.stat(filePath);
          
  
          // Update or add metadata in the frontmatter object
          frontmatter['created_on'] = formatDate(stats.birthtime.toISOString())
          frontmatter['updated_on'] = formatDate(stats.mtime.toISOString())
  
          // Serialize the frontmatter and merge it back with the content
          const updatedFrontmatter = YAML.dump(frontmatter);
          const updatedContent = `---\n${updatedFrontmatter}---\n${content}`;
  
          await fileManager.modify(file, updatedContent);
        } catch (error) {
          console.error(`Error updating frontmatter for file "${file.path}":`, error);
        }
      }
  
      console.log('Frontmatter metadata updated.');
  }
  
	async undoUpdateMetadata() {
    const fileManager = this.app.vault;
    const files = fileManager.getMarkdownFiles();

    for (const file of files) {
      try {
        const fileContent = await fileManager.read(file);
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = frontmatterRegex.exec(fileContent);
  
        if (match) {
          const frontmatter = YAML.load(match[1]);
          const content = match[2];
  
          if (frontmatter.hasOwnProperty('created_on') && frontmatter.hasOwnProperty('updated_on')) {
            console.log(file.basename);
            delete frontmatter['created_on'];
            delete frontmatter['updated_on'];

            // Serialize the frontmatter and merge it back with the content
            const updatedFrontmatter = YAML.dump(frontmatter);
            const updatedContent = `---\n${updatedFrontmatter}---\n${content}`;
  
            await fileManager.modify(file, updatedContent);
          }
          
          // If there are no more properties in the frontmatter, remove it
          if (Object.keys(frontmatter).length === 0) {
            await fileManager.modify(file, content);
            continue;
          }
        }
      } catch (error) {
        console.error(`Error undoing frontmatter update for file "${file.path}":`, error);
      }
    }

    console.log('Frontmatter metadata update undone.');
  }


  async updateFrontmatter(file: TFile) {
    // Load file content
    const fileContent = await this.app.vault.adapter.read(file.path);
    let frontmatter: any = {};
    let content = fileContent;
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = frontmatterRegex.exec(fileContent);

    if (match) {
        frontmatter = YAML.load(match[1]);
        content = match[2];
    }

    // Get file stats
    const filePath = this.app.vault.adapter.getFullPath(file.path);
    const stats = await fs.stat(filePath);

    // Update or add metadata in the frontmatter object
    frontmatter['created_on'] = formatDate(stats.birthtime.toISOString())
    frontmatter['updated_on'] = formatDate(stats.mtime.toISOString())

    // Serialize the frontmatter and merge it back with the content
    const updatedFrontmatter = YAML.dump(frontmatter);
    const updatedContent = `---\n${updatedFrontmatter}---\n${content}`;

    // Update file
    await this.app.vault.modify(file, updatedContent);
}
	
	
}
