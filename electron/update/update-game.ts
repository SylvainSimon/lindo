import {Logger} from '../core/logger/logger-lindo';
import {Application} from '../application';
import {ipcMain} from 'electron';
import {Versions} from "@interfaces/versions.interface";
import {UpdateWindow} from "../windows/update-window";

const settings = require('electron-settings');

export class UpdateGame {

    public static updateWindow: Electron.BrowserWindow;

    public static officialUpdate(): Promise<Versions> {
        return new Promise((resolve) => {
            Logger.info("[UPDATE] Game update started..");

            let destinationPath = Application.userDataPath + '/game';

            this.updateWindow = UpdateWindow.createWindow();

            void this.updateWindow.loadURL(`file://${Application.appPath}/dist/app/index.html#/official-game-update/` + encodeURIComponent(destinationPath));

            ipcMain.on('update-finished', (event, args) => {
                Logger.info("[UPDATE] Game update finished.");

                settings.setSync('buildVersion', args[0].buildVersion);
                this.updateWindow.close();
                resolve(args[0]);
            });
        });
    }

}
