<script lang="ts">

    import {selectedId, customPlayerNames, customTeamNames, gameState} from "$lib/store"
    import { GameEvent } from "$lib/GameEvent";
	import { onMount } from "svelte";
	import type { Player } from "$lib/types";
	
    let editMode = false;
    let connected = false;
    let focussed = true;
    let eventCode: string[] = [];
    let events: GameEvent[] = []
    let currentEvent: GameEvent | null = null;
    let waitingForSecondary = false;
    let SOSPlayerData: Player[] = [];

    let ws: WebSocket;

    const onKeyDown = (e:KeyboardEvent) => {

        if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || e.code == "Tab" || e.code == "Escape") return;

        //@ts-expect-error
        const targetId: string|undefined = e.target?.id;
        if(targetId?.includes("player_input") || targetId?.includes("team_input")) return editMode=true;
        editMode=false;


        if(["1","2","3","4","5","6"].includes(e.key) && eventCode.length == 0){
            selectedId.set(parseInt(e.key) - 1);
            return;
        }

        if(!$gameState) return;

        if(["7","8","9","0","F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].includes(e.key)) return;

        if(e.key == "Enter"){
            if(!waitingForSecondary){
                
                currentEvent = new GameEvent(eventCode, SOSPlayerData);
                if(!currentEvent.needsSecondary){
                    events = [...events, currentEvent];
                    eventCode = [];
                    return;      
                } else {
                    waitingForSecondary = true;
                    return;
                }
            } else{
                if(!currentEvent){
                    waitingForSecondary = false;
                    return;
                }
                currentEvent.setSecondary(SOSPlayerData[$selectedId].location);
                events = [...events, currentEvent];
                eventCode = [];
                waitingForSecondary = false;
                return;      
            }
        }

        if(e.key == "Backspace"){
            eventCode = eventCode.slice(0, eventCode.length-1);
            return;
        }

        eventCode = [...eventCode, e.key];
    }

    const onClick = (e:MouseEvent) => {
        //@ts-expect-error
        const targetId: string|undefined = e.target?.id;
        if(targetId?.includes("player_input") || targetId?.includes("team_input")) return editMode=true;
        editMode=false;
    }

    onMount(() => {
        open("ws://localhost:49122")
    })

    const updateSOSPlayerData = () => {
        const playerData: Player[] = [];
        for(const player in $gameState.players){
            const p: Player = {
                name: $gameState.players[player].name,
                location: {
                    X: $gameState.players[player].location.X,
                    Y: $gameState.players[player].location.Y,
                    Z: $gameState.players[player].location.Z
                },
                boost: $gameState.players[player].boost,
                team: $gameState.players[player].team
            }
            playerData.push(p);
        }
        playerData.sort((a, b) => a.team - b.team);
        SOSPlayerData = playerData;
    }

    const handleSOSMessage  = (msg: any) => {
        switch(msg.event){
            case "game:update_state":
                $gameState = msg.data;
                updateSOSPlayerData();
                break;
            case "game:match_destroyed":
                $gameState = null;
        }
    }

    const open = (uri: string) => {
        ws = new WebSocket(uri);
        ws.onopen = () => {
            console.log("ws opened");
            connected = true;
        }
        ws.onmessage = (e) => {
            handleSOSMessage(JSON.parse(e.data.toString()))
        }
        ws.onclose = (e) => {
            connected = false;
            console.log("attempting reconnect");
            $gameState = null;
            setTimeout(() => open(uri), 1000);
        }
        ws.onerror = (e) => {
            connected = false;
            console.log("ws error, closing");
        }
    }

    const handleSOSSync = (e: Event) => {
        //populate name entries
        console.log($gameState);
        updateSOSPlayerData();
        
        for(let [index, value] of SOSPlayerData.entries()){
            $customPlayerNames[index] = value.name;
        }

        //populate team entries
        for(let [index, value] of $gameState.game.teams.entries()){
            $customTeamNames[index] = value.name;
        }

    } 

    const handleSaveEvents = () => {
        let content = [["Team","Opponent Team","Player","Boost","X of player","Y of player","Z of player","Event","Outcome","Secondary Player","Secondary X","Secondary Y","Secondary Z", "Timestamp"]];
        for (let event of events){
            content.push(event.generateArray());
        }
        let string = content.map(line => line.join(",")).join("\n");
        const file = new File([string], "stats.csv");
        const url = window.URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href=url;
        a.download=file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }


</script>

<svelte:window on:keydown={onKeyDown} on:click={onClick} on:focus={() => focussed = true} on:blur={() => focussed=false} />
<div class="p-3 flex flex-col space-y-5 ">
    <div class="grid grid-flow-col space-x-2">
        <div class="flex flex-col space-y-2">
            <div id="teams" class="flex space-x-2">
                {#each [...Array(2).keys()] as i}
                <div class="flex-auto">
                    <div>
                        <input class="w-full border-b bg-transparent p-1 {i == 0 ? "text-myblue" : "text-mypink" }" id="{`team_input_${i}`}" type="text" bind:value={$customTeamNames[i]}>
                    </div>
                </div>
                    
                {/each}
            </div>
            <div id="players" class="flex space-x-2">
                {#each [...Array(6).keys()] as i}
                <div class="flex-auto">
                    <div class="text-mytext">
                        <input class="w-full border-b bg-transparent p-1 {i == $selectedId ? "border-green-400 text-green-400" : "" }" id="{`player_input_${i}`}" type="text" bind:value={$customPlayerNames[i]}>
                    </div>
                </div>
                    
                {/each}
            </div>
        </div>

        <div class="justify-self-end space-y-2">
            {#if connected}
            <p class="text-green-400">Connected to SOS!</p>

            {#if !!$gameState}
                <p>
                    <button class="bg-slate-200 hover:bg-slate-300 rounded-sm p-2" on:click={handleSOSSync}>Sync Names</button> 
                </p>
            {:else}
                <p>
                    Waiting for replay.
                </p>
            {/if}

            {:else}
            <span class="text-red-500">Couldn't connect to SOS. Is it running?</span>
            {/if}
            
        </div>

    </div>
    
    <hr>
    
    <div class="flex flex-col space-y-5 text-sm text-mytext" id="events">
        <div class="rounded-sm p-2" id="eventcode">
            <div class="flex flex-row space-x-5 ">
                <div>
                    <h2 class="underline text-myblue text-xl">Current Event Code</h2>
                </div>
              
              {#if !editMode && focussed && !!$gameState}
                <div class="text-red-500">Recording Keypresses</div>
                {#if waitingForSecondary}
                <div class="text-gray-400">Waiting for secondary enter</div>
                {/if}
              {/if}
              {#if editMode && focussed}
              <div class="text-gray-400">
                  Currently editing, not recording keypresses. Click elsewhere to resume recording keypresses.
              </div>
              {/if}
              {#if !$gameState}
                <div class="text-gray-400">
                    Cannot record macros - no game state was found. Please launch a replay file with SOS enabled.
                </div>
              {/if}
            </div>
            
            
            {#if !editMode}
                <div>
                    <p><code>{eventCode.join("")}</code></p>
                </div>
            {/if}
        </div>
        
        <hr>

        <div class="p-2 space-y-4 outline-myblue" id="eventlog">
            <div class="flex flex-row space-x-5 justify-between text-mytext">
                <h2 class="underline text-myblue text-xl">Event Log</h2>
                <div>
                    <button class="bg-myblue hover:bg-blue-400 text-mybackground rounded-sm p-2" on:click={handleSaveEvents}>Save Events</button>
                    <button class="bg-slate-200 hover:bg-slate-300 text-mybackground rounded-sm p-2" on:click={() => events = []}>Clear Events</button>
                </div>
            </div>
            <table class="w-full text-center border-collapse border-spacing-2">
                <tr class="text-mypink">
                    {#each ["Team","Opponent Team","Player","Boost","X of player","Y of player","Z of player","Event","Outcome","Secondary Player","Secondary X","Secondary Y","Secondary Z", "Timestamp"] as header}
                        <th class="border">{header}</th>
                    {/each}
                    
                </tr>
                {#each events as event}
                    <tr>
                        {#each event.generateArray() as col}
                            <td class="border">{col === null || col === undefined ? "N/A" : (!isNaN(col) ? Math.round(col*100)/100 : col)}</td>
                        {/each}
                    </tr>
                {/each}
            </table>

        </div>
    </div>
    
</div>
