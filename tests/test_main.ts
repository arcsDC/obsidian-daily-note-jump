import DailyNoteJumpPlugin from '../main';

describe('DailyNoteJumpPlugin', () => {
    let plugin: DailyNoteJumpPlugin;

    beforeEach(() => {
        // Mocking the Plugin base class and app context is complex in unit tests
        // without a full Obsidian environment. 
        // Here we test the static logic if exposed, or mock the instance.
        // Since formatDate is private, we test via public behavior or refactor.
        // For this basic test, we assume a mock context.
        const mockApp = {
            vault: {
                getAbstractFileByPath: jest.fn(),
                create: jest.fn()
            },
            workspace: {
                getLeaf: jest.fn(() => ({
                    openFile: jest.fn()
                }))
            }
        };
        
        // Cast to any to bypass constructor requirements for testing
        plugin = new DailyNoteJumpPlugin(mockApp as any, {} as any);
    });

    it('should format date correctly', () => {
        // Accessing private method for testing purposes
        const formatDate = (plugin as any).formatDate.bind(plugin);
        const date = new Date(2023, 9, 5); // Oct 5, 2023
        expect(formatDate(date)).toBe('2023-10-05');
    });

    it('should jump to existing daily note', async () => {
        const mockFile = { name: '2023-10-05.md' };
        (plugin.app.vault.getAbstractFileByPath as jest.Mock).mockReturnValue(mockFile);
        
        // Mock TFile check
        const TFile = require('obsidian').TFile;
        jest.spyOn(TFile, 'isPrototypeOf').mockReturnValue(true);

        await (plugin as any).jumpToDailyNote(new Date(2023, 9, 5));
        
        expect(plugin.app.vault.getAbstractFileByPath).toHaveBeenCalledWith('2023-10-05.md');
        expect(plugin.app.workspace.getLeaf().openFile).toHaveBeenCalledWith(mockFile);
    });
});
