<script lang="ts">
	import { onMount } from "svelte";
	import { events, outcomes } from "./Keybinds";

    onMount(() => {
        const modal = document.querySelector("#modal");

        document.querySelector("#showModal")?.addEventListener("click", ()=>{
            //@ts-ignore
            modal.showModal();
        })
        document.querySelector("#hideModal")?.addEventListener("click", ()=>{
            //@ts-ignore
            modal.close();
        })
    
    })
    
</script>

<dialog id="modal" class="rounded-sm  max-w-screen-md">


    <div id="header" class="sticky top-0 bg-slate-300 px-5 pt-5 space-y-3">
        <button id="hideModal" class="bg-mypink hover:bg-pink-400 text-mybackground rounded-sm p-2">Close</button>
        <h1 class="text-2xl">Help</h1>

        <hr />
    </div>



    <div id="content" class="p-5 space-y-5 bg-slate-50">
        
        <div class="space-y-2 text-sm">
            <h2 class="text-xl underline">Prerequisites</h2>
            <p>Make sure that the SOS plugin for BakkesMod is installed. This can be found on the <a href="https://gitlab.com/bakkesplugins/sos/sos-plugin/-/releases" class="underline">SOS GitLab repository.</a></p>   
        </div>

        <div class="space-y-2 text-sm">
            <h2 class="text-xl underline">How to use</h2>
            <p>Make sure Rocket League is running with the SOS BakkesMod plugin enabled.</p>
            <p>You can press the <b>Sync Names</b> button to automatically enter the player names and team names from the replay data.</p>
            <p>You can manually edit the names of the players and teams by clicking in the relevant box and typing the new name. These will be automatically saved.</p>
            <p>Use the 1-6 number keys to select a player.</p>
            <p>To start typing a macro, make sure the <b>Recording Keypresses</b> notice is visible. Then, start typing the macro according to the Keybinds below. Once you are done, press Enter, and the event will be recorded.</p>
            <p>Once you have recorded all of the events you wish to record, the data can be saved in a CSV format by clicking the <b>Save Events</b> button.</p>

        </div>
        
        <div class="space-y-2 text-sm">
            <h2 class="text-xl underline">Keybinds and Events</h2>
            {#each [...events] as [eventKey, eventValue]}
                <hr>
                <h3 class="text-lg"><code>{eventKey}</code> - {eventValue}</h3>
                <h4><b>Outcomes</b></h4>
                <ul>
                    {#each [...(outcomes.get(eventKey) ?? [])] as [outcomeKey, outcomeValue]}
                        <li><code>{outcomeKey}</code> - {outcomeValue}</li>
                    {/each}
                </ul>
            {/each}
        </div>
        
        <div class="space-y-2 text-sm">
            <h2 class="text-xl underline">Secondary Values</h2>
            <p>The <b>Challenge (50/50)</b>, <b>Goal</b>, and <b>Uncontested Play</b> events all have secondary values.</p>

            <h3 class="text-lg"><b>Challenge (50/50)</b></h3>
            <p>Enter the number of the player after the event and outcome in the macro. The secondary player's name will be recorded.</p>

            <h3 class="text-lg"><b>Goal</b></h3>
            <p>Enter <code>y</code> or <code>n</code> at the end of the macro to denote whether the goal was assisted or not.</p>

            <h3 class="text-lg"><b>Uncontested play</b></h3>
            <p>When you first press enter, the initial XYZ coordinates of the selected player will be recorded. Continue watching the replay until the play is over, then press enter for a second time to log the XYZ coordinates of the selected player at the end of the play. Both XYZ values will be recorded, with the latter being the secondary value.</p>
            
        </div>
    </div>




</dialog>

<button id="showModal" class="bg-mypink hover:bg-pink-400 text-mybackground rounded-sm p-2">
Help
</button>

