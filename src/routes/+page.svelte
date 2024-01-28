<script lang="ts">
    let editMode = false;
    let automatic = false;
    let connected = false;
    let focussed = true;
    let eventCode: string[] = [];
    let events: any[] = [];
    let SOSPlayerData: any[] = [];

    let ws: WebSocket;

    

    import {selectedId, customPlayerNames, teams, gameState} from "$lib/store"
    import { parseEventCode } from "$lib/eventHandler";
	import { onMount } from "svelte";

    $: selectedTeamId = $selectedId < 3 ? 0 : 1;
    $: if(!connected || !$gameState) automatic = false;

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

        if(["7","8","9","0","F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].includes(e.key)) return;

        if(e.key == "Enter"){
            console.log(SOSPlayerData[$selectedId])
            events = [...events, parseEventCode(eventCode, SOSPlayerData[$selectedId])];
            eventCode = [];
            return;
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

    const handleSOSMessage  = (msg: any) => {
        //console.log(msg)
        switch(msg.event){
            case "game:update_state":
                $gameState = msg.data;
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
            setTimeout(() => open(uri), 1000);
        }
        ws.onerror = (e) => {
            connected = false;
            console.log("ws error, closing");
        }
    }

    const handleAutomaticChange = (e: Event) => {
      if(automatic){
            //populate name entries
            console.log($gameState)
            const playerData = [];
            for(const player in $gameState.players){
                playerData.push($gameState.players[player]);
            }
            console.log(playerData)
            playerData.sort((a, b) => a.team - b.team)


            for(let [index, value] of playerData.entries()){
                $customPlayerNames[index] = value.name;
                SOSPlayerData[index] = value
            }

            //populate team entries
            for(let [index, value] of $gameState.game.teams.entries()){
                $teams[index] = value.name;
            }
        }  
    } 


</script>

<svelte:window on:keydown={onKeyDown} on:click={onClick} on:focus={() => focussed = true} on:blur={() => focussed=false}/>
<div class="p-3 flex flex-col space-y-5">
    <div class="grid grid-flow-col space-x-2">
        <div class="flex flex-col space-y-2">
            <div id="teams" class="flex space-x-2">
                {#each [...Array(2).keys()] as i}
                <div class="flex-auto">
                    <div class="outline-dashed">
                        <input class="w-full p-1 {i == 0 ? "bg-blue-400" : "bg-orange-400" }" id="{`team_input_${i}`}" type="text" bind:value={$teams[i]}>
                    </div>
                </div>
                    
                {/each}
            </div>
            <div id="players" class="flex space-x-2">
                {#each [...Array(6).keys()] as i}
                <div class="flex-auto">
                    <div class="outline-dashed">
                        <input class="w-full p-1 {i == $selectedId ? "bg-green-400" : "" }" id="{`player_input_${i}`}" type="text" bind:value={$customPlayerNames[i]}>
                    </div>
                </div>
                    
                {/each}
            </div>
        </div>

        <div class="justify-self-end p-2">
            {#if connected}
            <p class="text-green-400">Connected to SOS!</p>

            {#if !!$gameState}
                <p>
                    
                    <label>
                        <input type="checkbox" bind:checked={automatic} on:change={handleAutomaticChange}/>
                        Automatic Mode (additional information)
                    </label>
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
    
    
    <div class="flex flex-col space-y-2" id="events">
        <div class="outline p-2" id="eventcode">
            <div class="flex flex-row space-x-5">
                <div>
                    <h2 class="underline">Current Event Code</h2>
                </div>
              
              {#if !editMode && focussed}
                <div class="text-red-500">Recording Keypresses</div>
              {/if}
              {#if editMode && focussed}
              <div class="text-gray-400">
                  Currently editing, not recording keypresses. Click elsewhere to resume recording keypresses.
              </div>
              {/if}
            </div>
            
            
            {#if !editMode}
                <div>
                    <p><code>{eventCode.join("")}</code></p>
                </div>
            {/if}
        </div>
        
        
        
        <div class="outline p-2" id="eventlog">
            <h2 class="underline">Event Log</h2>
            {#each events as event}
                <div>
                    <code>
                        {JSON.stringify(event, null, 2)}
                    </code>
                    
                </div>
            {/each}
        </div>
    </div>
    
</div>
