import { customPlayerNames, customTeamNames, gameState, selectedId } from "./store";
import { get } from "svelte/store";
import type { Location, Player } from "./types";
import { events, outcomes } from "./Keybinds";

export class GameEvent {
    private customPlayerNames: string[];
    private customTeamNames: string[];
    private selectedId: number;
    private gameState: any;
     eventCode: string[];
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
        this.timestamp = this.gameState.game.elapsed;
  

        //overwrite SOS name with custom name
        this.player.name = this.customPlayerNames[this.selectedId];

        //make eventcode lowercase
        this.eventCode = this.eventCode.map(c => c.toLowerCase());

        
        if(this.eventCode.length === 0) throw new Error("Empty");
    
        //get event name
        const eventLetter = this.eventCode[0];
        this.event = events.get(eventLetter) ?? "invalid";
        if(this.event === "invalid") throw new Error(`Invalid event ${eventLetter}`);

        //get outcome
        const outcomeLetter = this.eventCode[1];
        this.outcome = outcomes.get(eventLetter)?.get(outcomeLetter) ?? "invalid";
        if(this.outcome === "invalid") throw new Error(`Invalid outcome ${outcomeLetter} for event ${this.event}`);


        console.log(eventCode[0])
        //is secondary needed
        if(eventCode[0] === "c"){ //if 50/50 get other player name
            if(eventCode[2]){
                const secondaryPlayerId: number = parseInt(eventCode[2]) - 1;
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


    //["Team","Opponent Team","Player","Boost","X of player","Y of player","Z of player","Event","Outcome","Secondary Player","Secondary X","Secondary Y","Secondary Z"]
    generateArray(){
        const [team, opponentTeam] = this._getTeamNames(this.selectedId);
        
        let secondaryArray: any = [null,null,null,null];
        if(this.event === "Uncontested play"){
            secondaryArray = [, (this.secondary as Location).X, (this.secondary as Location).Y, (this.secondary as Location).Z]
        } else if (this.event === "Challenge (50/50)"){
            secondaryArray = [(this.secondary as string),null,null,null]
        }
        return [team, opponentTeam, this.player.name, this.player.boost, this.player.location.X, this.player.location.Y, this.player.location.Z, this.event, this.outcome, ...secondaryArray, this.timestamp]
    }

    private _getTeamNames (playerId: number) {
        return this.selectedId < 3 ? this.customTeamNames : this.customTeamNames.toReversed();
    }

}

