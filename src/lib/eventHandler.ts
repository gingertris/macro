
export const parseEventCode = (eventCodeString: string, target: number, players: string[]) => {
    eventCodeString = eventCodeString.toLowerCase();
    const eventCode = eventCodeString.split("");

    if(eventCode.length === 0) throw new Error("Empty");

    let result;
    switch(eventCode.shift()){
        case "s":
            result = handleShot(eventCode, target, players)
            break;
    }

    return result;
}

const handleShot = (eventCode: string[], target:number, players: string[]) => {
    const locationCode = eventCode.splice(0,2); //Shot location is two letters long
    
    const successfulCode = eventCode.shift();
    let successful: boolean;
    if(successfulCode === "s") successful = true;
    else if(successfulCode === "n") successful = false;
    else throw new Error("Invalid success of shot.");

    return {player: players[target], data:{
        type:"shot",
        location:locationCode,
        successful
    }}

}