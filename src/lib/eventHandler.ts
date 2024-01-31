import { customPlayerNames, customTeamNames, gameState, selectedId } from "./store";
import { get } from "svelte/store";

export const parseEventCode = (eventCode: string[], playerData: any) => {

    const $customPlayerNames = get(customPlayerNames);
    const $customTeamNames = get(customTeamNames);
    const $selectedId = get(selectedId);
    const $gameState = get(gameState)


    const [myTeamName, opponentTeamName] = $selectedId < 3 ? $customTeamNames : $customTeamNames.toReversed();

    console.log($gameState)

    return {
        team: myTeamName,
        opponent: opponentTeamName,
        player: $customPlayerNames[$selectedId],
        boost: playerData.boost,
        location: {
            x: playerData.location.X,
            y: playerData.location.Y,
            z: playerData.location.Z

        },
        timestamp: $gameState.game.elapsed
    }

    //below this is old code, above is proof of concept code

    eventCode = eventCode.map(c => c.toLowerCase());

    if(eventCode.length === 0) throw new Error("Empty");

    switch(eventCode.shift()){
        case "s": //shot
            return handleShot(eventCode, playerData)
        case "c": //contested hit (challenge, 50/50 etc)
            return handleContestedHit(eventCode, playerData)
        case "u": //uncontested hit
            return handleUncontestedHit(eventCode, playerData)

    }

}

const handleUncontestedHit = (eventCode: string[], playerData: any) => {

};

const handleContestedHit = (eventCode: string[], playerData: any) => {

};

const handleShot = (eventCode: string[], playerData: any) => {
    const locationCode = eventCode.splice(0,2); //Shot location is two letters long
    
    const successfulCode = eventCode.shift();
    let successful: boolean;
    if(successfulCode === "s") successful = true;
    else if(successfulCode === "n") successful = false;
    else throw new Error("Invalid success of shot.");

    const $customPlayerNames = get(customPlayerNames);
    const $selectedId = get(selectedId);


    return {player: $customPlayerNames[$selectedId], data:{
        type:"shot",
        location:locationCode,
        successful
    }}

}