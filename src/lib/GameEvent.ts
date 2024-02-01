import { customPlayerNames, customTeamNames, gameState, selectedId } from "./store";
import { get } from "svelte/store";
import type { Location, Player } from "./types";



export class GameEvent {
    private customPlayerNames: string[];
    private customTeamNames: string[];
    private selectedId: number;
    private gameState: any;
    private eventCode: string[];
    private player: Player;
    private secondary?: Location | string;
    private event: string;
    private outcome: string;
    private timestamp: number;
    needsSecondary: boolean;

    constructor(eventCode: string[], SOSPlayerData: Player[]){
        this.customPlayerNames = get(customPlayerNames);
        this.customTeamNames = get(customTeamNames);
        this.selectedId = get(selectedId);
        this.gameState = get(gameState);
        this.eventCode = eventCode;
        this.player = SOSPlayerData[this.selectedId];
        this.needsSecondary = false;
        this.timestamp = this.gameState.elapsed;

        //overwrite SOS name with custom name
        this.player.name = this.customPlayerNames[this.selectedId];

        //make eventcode lowercase
        this.eventCode = this.eventCode.map(c => c.toLowerCase());

        
        if(this.eventCode.length === 0) throw new Error("Empty");
    
        //get event name
        const eventLetter = this.eventCode[0];
        this.event = this._events.get(eventLetter) ?? "invalid";
        if(this.event === "invalid") throw new Error(`Invalid event ${eventLetter}`);

        //get outcome
        const outcomeLetter = this.eventCode[1];
        this.outcome = this._outcomes.get(eventLetter)?.get(outcomeLetter) ?? "invalid";
        if(this.outcome === "invalid") throw new Error(`Invalid outcome ${outcomeLetter} for event ${this.event}`);


        console.log(eventCode[0])
        //is secondary needed
        if(eventCode[0] === "c"){ //if 50/50 get other player name
            if(eventCode[2]){
                const secondaryPlayerId: number = parseInt(eventCode[2]);
                this.secondary = this.customPlayerNames[secondaryPlayerId];
            } else{
                throw new Error(`Secondary for event ${eventCode} not found in code.`)
            }
        }

        if(eventCode[0] === "u"){
            this.needsSecondary = true;
        }
    }

    setSecondary(secondary: Location){
        this.secondary = secondary;
    }

    outputJSON() { //toJSON is already taken
        const [myTeamName,opponentTeamName] = this._getTeamNames(this.selectedId);
        return {
            myTeamName,
            opponentTeamName,
            player: this.player,
            event: this.event,
            outcome: this.outcome,
            secondary: this.secondary,
            timestamp: this.timestamp
        }

    }

    private _getTeamNames (playerId: number) {
        return this.selectedId < 3 ? this.customTeamNames : this.customTeamNames.toReversed();
    }

    private _events = new Map(Object.entries({
        s: "Shot",
        g: "Goal",
        u: "Uncontested play",
        c: "Challenge (50/50)",
        f: "First block"
    }))

    private _outcomes = new Map(Object.entries({
        s: new Map(Object.entries({ //shot
            m: "Miss",
            t: "Save and turnover",
            g: "Leads to goal",
            p: "Pressure retaining",
        })),
        g: new Map(Object.entries({ //goal
            b: "Beats defender",
            t: "Touched",
            o: "Open net"
        })),
        u: new Map(Object.entries({ //uncontested play
            p: "Possession retaining",
            u: "Unclear",
            t: "Uncontested turnover"
        })),
        c: new Map(Object.entries({ //challenge or 50/50
            n: "Neutral outcome",
            w: "Possession won",
            l: "Possession Lost"
        })),
        f: new Map(Object.entries({ //first block
            b: "Ball hit",
            p: "Player Hit, no ball contact",
            n: "Player not Hit, no ball contact"
        }))
    }))

}

