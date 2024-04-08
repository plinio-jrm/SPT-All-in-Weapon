/* eslint-disable @typescript-eslint/brace-style */
import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

import { ModConstants } from "./constants";

class Mod implements IPostDBLoadMod {
    private logger: ILogger;

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.info(ModConstants.LOADING);
    }

    public postDBLoad(container: DependencyContainer): void {
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables: IDatabaseTables = databaseServer.getTables();

        
    }

    public postAkiLoad(container: DependencyContainer): void {
        this.logger.success(ModConstants.LOADED);
    }

    private Log(message: string): void {
        this.logger.logWithColor(ModConstants.LOG + " " + message, LogTextColor.CYAN);
    }
}

module.exports = { mod: new Mod() }