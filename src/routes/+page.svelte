<script lang="ts">
    let editMode = false;
    const playerNames:string[] = ["","","","","",""];
    let selectedId: number = 0;

    const onKeyDown = (e:KeyboardEvent) => {
        //@ts-expect-error
        const targetId: string|undefined = e.target?.id;
        if(targetId?.includes("player_input")) return editMode=true;
        editMode=false;

        console.log(e);
        console.log(playerNames);

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
        <div class="flex-auto grid grid-cols-1 gap-y-2">
            <div class="col-auto text-center  {i == selectedId ? "bg-green-400" : "" }">Player {i+1}</div>
            <div class="outline col-auto">
                <input class="w-full" id="{`player_input_${i}`}" type="text" bind:value={playerNames[i]} placeholder="Enter name">
            </div>
        </div>
            
        {/each}
    </div>
    
    <div class="flex flex-col space-y-2">
        <div class="outline p-2">
            <h2 class="underline">Current Event</h2>
            {#if editMode}
                <div>
                    Currently editing, not recording keypresses. Click on me to resume recording keypresses.
                </div>
            {:else}
                <div>
                    <p>Target: {playerNames[selectedId]}</p>
                </div>
            {/if}
        </div>
        
        
        
        <div class="outline p-2">
            <h2 class="underline">Events</h2>
        </div>
    </div>
    
</div>
