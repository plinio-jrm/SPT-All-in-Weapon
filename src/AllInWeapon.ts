/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/brace-style */
import { inject, injectable } from "tsyringe";

import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ITemplateItem, Slot, SlotFilter } from "@spt-aki/models/eft/common/tables/ITemplateItem";

import { Settings } from "./types";
import { ModConstants } from "./constants";

@injectable()
export class AllInWeapon {
    private settings: Settings = require("../config/settings.json");
    private items: any;

    private ammoIdList: string[] = [];
    private allModIdList: string[] = [];
    private modsIdBySlotCategory: Record<string, string[]>;

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
            // get all items
            if (item._parent === this.settings.IDs.Ammo)
                this.ammoIdList.push(item._id);

            // get all mods and mods by the slot category
            if (item._props.Slots !== undefined) {
                for (const slotIndex in item._props.Slots) {
                    const slot: Slot = item._props.Slots[slotIndex];

                    for (const slotFilterIndex in slot._props.filters) {
                        const slotFilter: SlotFilter = slot._props.filters[slotFilterIndex];

                        for (const modIndex in slotFilter.Filter) {
                            const modId: string = slotFilter.Filter[modIndex];

                            if (slot._name === ModConstants.MAG_SLOT_NAME) {
                                // all the mods
                                if (this.allModIdList === undefined) {
                                    this.allModIdList = [modId];
                                } else if (this.allModIdList.indexOf(modId) === -1)
                                    this.allModIdList.push(modId);
                            }

                            // mods by slot category
                            if (this.modsIdBySlotCategory[slot._name] === undefined) {
                                this.modsIdBySlotCategory[slot._name] = [modId];
                            } else if (this.modsIdBySlotCategory[slot._name].indexOf(modId) === -1)
                                this.modsIdBySlotCategory[slot._name].push(modId);
                        }
                    }
                }
            }
        });
    }

    private process(): void {
        this.processAmmo();
        this.processMagazines();
        this.processCursed();
    }

    private processAmmo(): void {
        if (this.settings.AllowAnyAmmo === false)
            return;

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

    private processMagazines(): void {
        if (this.settings.AllowAnyMag === false)
            return;

        this.itemsForFunc((item) => {
            if (item._props.Slots === undefined)
                return;

            for (const slotIndex in item._props.Slots) {
                const slot: Slot = item._props.Slots[slotIndex];
                if (slot._name !== ModConstants.MAG_SLOT_NAME)
                    continue;

                for (const slotFilterIndex in slot._props.filters) {
                    const slotFilter: SlotFilter = slot._props.filters[slotFilterIndex];

                    slotFilter.Filter = [];
                    slotFilter.Filter = [...this.modsIdBySlotCategory[ModConstants.MAG_SLOT_NAME]];
                }
            }
        });
    }

    private processCursed(): void {

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