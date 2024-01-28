import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";



const storedSelectedId = localStorage.getItem("selectedId");
export const selectedId = writable(parseInt(storedSelectedId || "0"));
if(browser){
    selectedId.subscribe(value => {
        localStorage.setItem("selectedId", value.toString())
    })
}

const storedCustomPlayerNames = JSON.parse(localStorage.getItem("players") || JSON.stringify(["Player 1","Player 2","Player 3","Player 4","Player 5","Player 6"]));
export const customPlayerNames = writable(storedCustomPlayerNames);
if(browser){
    customPlayerNames.subscribe(value => {
        localStorage.setItem("players", JSON.stringify(value))
    })
}

const storedTeams = JSON.parse(localStorage.getItem("teams") || JSON.stringify(["Team 1","Team 2"]));
export const teams = writable(storedTeams);
if(browser){
    teams.subscribe(value => {
        if(value.length > 2) value = [value[0], value[1]];
        localStorage.setItem("teams", JSON.stringify(value))
    })
}

export const gameState: Writable<any> = writable(null);