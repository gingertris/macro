<script lang="ts">
    let editMode = false;
    const playerNames:string[] = ["Player 1","Player 2","Player 3","Player 4","Player 5","Player 6"];
    let selectedId: number = 0;

    const onKeyDown = (e:KeyboardEvent) => {
        //@ts-expect-error
        const targetId: string|undefined = e.target?.id;

        if(targetId?.includes("player_input")) return editMode=true;
        editMode=false;

        console.log(e);

        if(["1","2","3","4","5","6"].includes(e.key)){
            selectedId = parseInt(e.key) - 1;
        }

    }
    const onClick = (e:MouseEvent) => {
        //@ts-expect-error
        const targetId: string|undefined = e.target?.id;
        if(targetId?.includes("player_input")) return editMode=true;
        editMode=false;
    }


</script>

<svelte:window on:keydown={onKeyDown} on:click={onClick}/>
<div class="p-3 flex flex-col space-y-5">
    <div id="players" class="flex space-x-3">
        {#each [0,1,2,3,4,5] as i}
        <div class="flex-auto">
            <div class="outline-dashed">
                <input class="w-full p-1 {i == selectedId ? "bg-green-400" : "" }" id="{`player_input_${i}`}" type="text" bind:value={playerNames[i]}>
            </div>
        </div>
            
        {/each}
    </div>
    
    <div class="flex flex-col space-y-2" id="events">
        <div class="outline p-2" id="currentevent">
            <h2 class="underline">Current Event</h2>
            {#if editMode}
                <div>
                    Currently editing, not recording keypresses. Click elsewhere to resume recording keypresses.
                </div>
            {:else}
                <div>
                    <p>Target: {playerNames[selectedId]}</p>
                </div>
            {/if}
        </div>
        
        
        
        <div class="outline p-2" id="eventlog">
            <h2 class="underline">Event Log</h2>
        </div>
    </div>
    
</div>
