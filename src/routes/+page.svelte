<script lang="ts">
    let editMode = false;
    let eventCode: string[] = [];
    let events: any[] = [];
    import {selectedId, players, teams} from "$lib/store"
    import { parseEventCode } from "$lib/eventHandler";

    $: selectedTeamId = $selectedId < 3 ? 0 : 1;

    const onKeyDown = (e:KeyboardEvent) => {

        if(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey || e.code == "Tab") return;

        console.log(e)

        //@ts-expect-error
        const targetId: string|undefined = e.target?.id;
        if(targetId?.includes("player_input") || targetId?.includes("team_input")) return editMode=true;
        editMode=false;

        if(["1","2","3","4","5","6"].includes(e.key)){
            selectedId.set(parseInt(e.key) - 1);
            return;
        }

        if(["7","8","9","0","F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"].includes(e.key)) return;

        if(e.key == "Enter"){
            events = [...events, parseEventCode(eventCode, $selectedId, $players)];
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

</script>

<svelte:window on:keydown={onKeyDown} on:click={onClick}/>
<div class="p-3 flex flex-col space-y-5">
    <div class="flex flex-col space-y-2">
        <div id="teams" class="flex space-x-2">
            {#each [0,1] as i}
            <div class="flex-auto">
                <div class="outline-dashed">
                    <input class="w-full p-1 {i == 0 ? "bg-blue-400" : "bg-orange-400" }" id="{`team_input_${i}`}" type="text" bind:value={$teams[i]}>
                </div>
            </div>
                
            {/each}
        </div>
        <div id="players" class="flex space-x-2">
            {#each [0,1,2,3,4,5] as i}
            <div class="flex-auto">
                <div class="outline-dashed">
                    <input class="w-full p-1 {i == $selectedId ? "bg-green-400" : "" }" id="{`player_input_${i}`}" type="text" bind:value={$players[i]}>
                </div>
            </div>
                
            {/each}
        </div>
    </div>
    
    
    <div class="flex flex-col space-y-2" id="events">
        <div class="outline p-2" id="eventcode">
            <h2 class="underline">Current Event Code</h2>
            {#if editMode}
                <div>
                    Currently editing, not recording keypresses. Click elsewhere to resume recording keypresses.
                </div>
            {:else}
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
