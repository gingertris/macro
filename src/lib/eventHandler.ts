import { customPlayerNames, customTeamNames, gameState, selectedId } from "./store";
import { get } from "svelte/store";

type Event = {
    myTeamName: string,
    opponentTeamName: string,
    playerName: string,
    boost: number,
    position: Position
    event: string,
    outcome: string, 
    secondary?: Position | string
}

type Position = {
    X: number, 
    Y: number,
    Z: number
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
    eventCode = eventCode.map(c => c.toLowerCase());

    if(eventCode.length === 0) throw new Error("Empty");

    return 

}

const handleBlock = (eventCode: string[], playerData: any) => {

}

const handleGoal = (eventCode: string[], playerData: any) => {

}

const handleShot = (eventCode: string[], playerData: any) => {

}

const handleUncontested = (eventCode: string[], playerData: any) => {

}

const handleFifty = (eventCode: string[], playerData: any) => {
    return {
        eventName: "50/50",
        outcome: "good",
        secondary: {
            X: 1,
            Y: 2,
            Z: 3
        }
    }
}