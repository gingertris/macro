
export const parseEventCode = (eventCodeString: string, selectedId: number, players: string[]) => {
    eventCodeString = eventCodeString.toLowerCase();
    const eventCode = eventCodeString.split("");

    if(eventCode.length === 0) throw new Error("Empty");

    switch(eventCode.shift()){
        case "s": //shot
            return handleShot(eventCode, selectedId, players)
        case "c": //contested hit (challenge, 50/50 etc)
            return handleContestedHit(eventCode, selectedId, players)
        case "u": //uncontested hit
            return handleUncontestedHit(eventCode, selectedId, players)

    }

}

const handleUncontestedHit = (eventCode: string[], selectedId:number, players:string[]) => {

};

const handleContestedHit = (eventCode: string[], selectedId:number, players:string[]) => {

};

const handleShot = (eventCode: string[], selectedId:number, players: string[]) => {
    const locationCode = eventCode.splice(0,2); //Shot location is two letters long
    
    const successfulCode = eventCode.shift();
    let successful: boolean;
    if(successfulCode === "s") successful = true;
    else if(successfulCode === "n") successful = false;
    else throw new Error("Invalid success of shot.");

    return {player: players[selectedId], data:{
        type:"shot",
        location:locationCode,
        successful
    }}

}