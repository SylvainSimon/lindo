import {Logger} from './logger/logger-lindo';

const electronLocalShortcut = require('electron-localshortcut');
const settings = require('electron-settings');
const async = require('async');

/** TODO a déplacer dans l'app */

export class ShortCuts {

    private readonly win: Electron.BrowserWindow;
    private readonly isBound: boolean;

    constructor(win: Electron.BrowserWindow) {
        this.win = win;
        this.isBound = false;
    }

    public bindAll(): void {

        let errorConsoleFunction = console.error;
        console.error = function () {
        }

        void async.forEachOf(settings.getSync('option.shortcuts.no_emu.tabs'), (shortcut: string, index: number) => {
            if (shortcut) {
                try {
                    electronLocalShortcut.register(this.win, ShortCuts.convert(shortcut), () => {
                        this.win.webContents.send('switch-tab', index);
                    });
                } catch (e) {
                    //console.log(e);
                }
            }
        });

        console.error = errorConsoleFunction;
    }

    public reload(): void {
        electronLocalShortcut.unregisterAll(this.win);
        this.bindAll();
        Logger.info('emit->reload-shortcuts');
        this.win.webContents.send('reload-shortcuts');
    }

    public enable(): void {
        if (!this.isBound) {
            this.bindAll()
        } else {
            electronLocalShortcut.enableAll(this.win);
        }
    }

    public disable(): void {
        electronLocalShortcut.disableAll(this.win);
    }

    public static convert(shortcut: string): string {
        shortcut = shortcut.replace('ctrl', 'CmdOrCtrl');

        return shortcut;
    }
}
