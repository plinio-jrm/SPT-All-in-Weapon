/* eslint-disable @typescript-eslint/brace-style */
import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

import { ModConstants, ClassConstants } from "./constants";
import { AllInWeapon } from "./AllInWeapon";

class Mod implements IPostDBLoadMod {
    private allInWeapon: AllInWeapon;
    private logger: ILogger;

    public preAkiLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.info(ModConstants.LOADING);

        container.register<AllInWeapon>(ClassConstants.ALL_IN_WEAPON, AllInWeapon);
    }

    public postDBLoad(container: DependencyContainer): void {
        this.allInWeapon = container.resolve<AllInWeapon>(ClassConstants.ALL_IN_WEAPON);
    }

    public postAkiLoad(container: DependencyContainer): void {
        this.logger.success(ModConstants.LOADED);
    }
}

module.exports = { mod: new Mod() }