<script lang="ts">
    let editMode = false;
    const playerNames:string[] = ["","","","","",""];
    const selectedId: number = 0;

    const onKeyDown = (e:KeyboardEvent) => {
        //@ts-expect-error
        const targetId: string|undefined = e.target?.id;
        if(targetId?.includes("player_input")) return editMode=true;
        editMode=false;

        console.log(e);
        console.log(playerNames);
    }
    const onClick = (e:MouseEvent) => {
        //@ts-expect-error
        const targetId: string|undefined = e.target?.id;
        if(targetId?.includes("player_input")) return editMode=true;
        editMode=false;
    }

</script>

<svelte:window on:keydown={onKeyDown} on:click={onClick}/>

<div id="players" class="flex space-x-3 p-3">
    {#each [0,1,2,3,4,5] as i}
    <div class="flex-auto grid grid-cols-1 gap-y-2">
        <div class="col-auto text-center">Player {i}</div>
        <div class="outline col-auto">
            <input class="w-full" id="{`player_input_${i}`}" type="text" bind:value={playerNames[i]} placeholder="Enter name">
        </div>
    </div>
        
    {/each}
</div>

<div>
    <h3>Current Event</h3>
    {#if editMode}
        <div>
            Currently editing, not recording keypresses. Click on me to resume recording keypresses.
        </div>
    {:else}
        <div>
            
        </div>
    {/if}
</div>


<div>
    <h3>Events</h3>
</div>