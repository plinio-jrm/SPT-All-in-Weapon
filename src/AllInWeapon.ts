/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/brace-style */
import { inject, injectable } from "tsyringe";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ITemplateItem, Slot, SlotFilter } from "@spt-aki/models/eft/common/tables/ITemplateItem";

import { Settings } from "./types";

@injectable()
export class AllInWeapon {
    private settings: Settings = require("../config/settings.json");
    private items: any;

    private ammoIdList: string[] = [];

    constructor(
        @inject("DatabaseServer") private db: DatabaseServer,
        @inject("WinstonLogger") private logger: ILogger
    ) {
        if (this.settings.Active === false)
            return;

        this.items = db.getTables().templates.items;
        this.setup();
        this.process();
    }

    private setup(): void {
        this.itemsForFunc((item) => {
            if (item._parent === this.settings.IDs.Ammo)
                this.ammoIdList.push(item._id);
        });
    }

    private process(): void {
        this.itemsForFunc((item) => {
            if (this.isMagazine(item)) {
                for (const index in item._props.Cartridges) {
                    const cartridge: Slot = item._props.Cartridges[index];
                    this.addAmmoToFilter(cartridge._props.filters);
                }
            }

            if (this.isWeapon(item)) {
                for (const index in item._props.Chambers) {
                    const chamber: Slot = item._props.Chambers[index];
                    this.addAmmoToFilter(chamber._props.filters);
                }
            }
        });
    }

    private itemsForFunc(method: (items: ITemplateItem) => void): void {
        for (const index in this.items) {
            const item: ITemplateItem = this.items[index];
            method(item);
        }
    }

    private isMagazine(item: ITemplateItem): boolean {
        if (item._parent !== this.settings.IDs.Magazine)
            return false;
        if (item._props.Cartridges === undefined)
            return false;

        return true;
    }

    private isWeapon(item: ITemplateItem): boolean {
        if (item._parent !== this.settings.IDs.Weapon)
            return false;
        if (item._props.Chambers === undefined)
            return false;

        return true;
    }

    private addAmmoToFilter(filters: SlotFilter[]): void {
        for (const index in filters) {
            const slotFilter: SlotFilter = filters[index];
            slotFilter.Filter = [];
            slotFilter.Filter.push(...this.ammoIdList);
        }
    }
}