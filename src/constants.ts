/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/brace-style */
export class ModConstants {
    public static MOD_NAME: string = "All in Weapon";
    public static LOG: string = this.MOD_NAME + ": ";
    public static LOADING: string = this.LOG + "is loading...";
    public static LOADED: string = this.LOG + "The curse series is loaded. Have fun!";
    
    public static MAG_SLOT_NAME: string = "mod_magazine";
}

export class MessageConstants {
    public static ANYAMMO: string = ModConstants.LOG + "any ammo will be possible to be loaded now!";
    public static ANYMAG: string = ModConstants.LOG + "any magazine can be loaded in any weapon!";
    public static CURSED: string = ModConstants.LOG + "Yeah... monster weapons (Cursed)... here we go.";
    public static CURSED_FUCKITALL: string = ModConstants.LOG + "I do not recommend using 'Fuck it all', so don't come to me saying that you cannot see all items.";
}

export class ClassConstants {
    public static ALL_IN_WEAPON: string = "AllInWeapon";
}