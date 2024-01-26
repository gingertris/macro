import { writable } from "svelte/store";
import { browser } from "$app/environment";



const storedSelectedId = localStorage.getItem("selectedId");
export const selectedId = writable(parseInt(storedSelectedId || "0"));
if(browser){
    selectedId.subscribe(value => {
        localStorage.setItem("selectedId", value.toString())
    })
}

const storedPlayers = JSON.parse(localStorage.getItem("players") || JSON.stringify(["Player 1","Player 2","Player 3","Player 4","Player 5","Player 6"]));
export const players = writable(storedPlayers);
if(browser){
    players.subscribe(value => {
        localStorage.setItem("players", JSON.stringify(value))
    })
}