import { Plugin, Notice, TFile } from "obsidian";

export default class DailyNoteJumpPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: "jump-to-daily-note",
            name: "Jump to daily note",
            callback: () => this.jumpToDailyNote(new Date())
        });

        this.addCommand({
            id: "jump-to-daily-note-today",
            name: "Jump to today's daily note",
            callback: () => this.jumpToDailyNote(new Date())
        });
    }

    private async jumpToDailyNote(date: Date) {
        const formattedDate = this.formatDate(date);
        const fileName = `${formattedDate}.md`;
        
        // Search for the file in the vault
        const file = this.app.vault.getAbstractFileByPath(fileName);
        
        if (file instanceof TFile) {
            await this.app.workspace.getLeaf().openFile(file);
        } else {
            // If not found, create a new daily note
            const newFile = await this.app.vault.create(fileName, `# ${formattedDate}\n`);
            await this.app.workspace.getLeaf().openFile(newFile);
            new Notice(`Created new daily note: ${fileName}`);
        }
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
