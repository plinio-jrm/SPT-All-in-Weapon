/* eslint-disable @typescript-eslint/brace-style */
export interface Settings {
    Active: boolean;
    Cursed: boolean; // if enabled any "mod" will be able to fit in any slot.
    AllowAnyMag: boolean;
    AllowAnyAmmo: boolean;
    IDs: IDs;
}

export interface IDs {
    Ammo: string;
    Magazine: string;
    Weapon: string;
}