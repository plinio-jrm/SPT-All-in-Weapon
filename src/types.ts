/* eslint-disable @typescript-eslint/brace-style */
export interface Settings {
    Active: boolean;
    Cursed: Cursed; // if enabled any "mod" will be able to fit in any slot.
    AllowAnyMag: boolean;
    AllowAnyAmmo: boolean;
    IDs: IDs;
}

export interface IDs {
    Blacklist: string[];
    Ammo: string;
    Magazine: string;
    Weapon: string;
}

export interface Cursed {
    Enable: boolean;
    FuckItAll: boolean;
}