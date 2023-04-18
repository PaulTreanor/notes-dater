import { Plugin } from 'obsidian';
import * as YAML from 'js-yaml';


export default class MetadataExamplePlugin extends Plugin {
  async onload() {
    console.log('Loading MetadataExamplePlugin');

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
		
  }

  async onunload() {
    console.log('Unloading MetadataExamplePlugin');
  }

  async updateMetadata() {
		const fileManager = this.app.vault;
		const files = fileManager.getMarkdownFiles();
	
		for (const file of files) {
      try {
        const fileContent = await fileManager.read(file);
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = frontmatterRegex.exec(fileContent);

        let frontmatter = {};
        let content = fileContent;

        if (match) {
          frontmatter = YAML.load(match[1]);
          content = match[2];
        }

        // Update or add metadata in the frontmatter object
        frontmatter['custom_property'] = 'custom_value';

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
  
          if (frontmatter.hasOwnProperty('custom_property')) {
            delete frontmatter['custom_property'];
  
            // Serialize the frontmatter and merge it back with the content
            const updatedFrontmatter = YAML.dump(frontmatter);
            const updatedContent = `---\n${updatedFrontmatter}---\n${content}`;
  
            await fileManager.modify(file, updatedContent);
          }
        }
      } catch (error) {
        console.error(`Error undoing frontmatter update for file "${file.path}":`, error);
      }
    }

    console.log('Frontmatter metadata update undone.');
  }
	
	
}
