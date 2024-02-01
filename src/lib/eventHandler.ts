import { customPlayerNames, customTeamNames, gameState, selectedId } from "./store";
import { get } from "svelte/store";

type Event = {
    myTeamName: string,
    opponentTeamName: string,
    playerName: string,
    boost: number,
    X: number,
    Y: number,
    Z: number,
    event: string,
    outcome: string, 
    secondaryX?: number,
    secondaryY?: number,
    secondaryZ?: number,
    secondaryPlayer?: number
}


const getTeamName = (playerId: number) => {
    const $customTeamNames = get(customTeamNames);
    const $selectedId = get(selectedId);
    return $selectedId < 3 ? $customTeamNames[0] : $customTeamNames[1];
} 

const getContext = () => {
    const $customPlayerNames = get(customPlayerNames);
    const $customTeamNames = get(customTeamNames);
    const $selectedId = get(selectedId);
    const $gameState = get(gameState)

    const [myTeamName, opponentTeamName] = $selectedId < 3 ? $customTeamNames : $customTeamNames.toReversed();

    return {
        myTeamName,
        opponentTeamName,
        playerName: $customPlayerNames[$selectedId]
    }

}



export const parseEventCode = (eventCode: string[], playerData: any) => {

    const context = getContext();
    const preHandledEvent = {
        ...context,
        boost: playerData.boost,
        X: playerData.location.X,
        Y: playerData.location.Y,
        Z: playerData.location.Z,
    }

    eventCode = eventCode.map(c => c.toLowerCase());

    if(eventCode.length === 0) throw new Error("Empty");

    switch(eventCode.shift()){
        case "s": //shot
            return handleShot(eventCode, playerData)
        case "f": // 50-50
            return handleFifty(eventCode, playerData);
        case "u": //uncontested
            return handleUncontested(eventCode, playerData);
        case "g": //goal
            return handleGoal(eventCode, playerData);
        case "b": //first block
            return handleBlock(eventCode, playerData);
    }

}

const handleFifty = (eventCode: string[], playerData: any) => {

}

const handleBlock = (eventCode: string[], playerData: any) => {

}

const handleGoal = (eventCode: string[], playerData: any) => {

}

const handleUncontested = (eventCode: string[], playerData: any) => {

}

const handleShot = (eventCode: string[], playerData: any) => {

}