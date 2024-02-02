# Macro

A tool for assisting in recording various statistics for Rocket League games. 

## Prerequisites

Make sure that the SOS plugin for BakkesMod is installed. This can be found on the [SOS GitLab repository](https://gitlab.com/bakkesplugins/sos/sos-plugin/-/releases).

## How to use

Make sure Rocket League is running with the SOS BakkesMod plugin enabled.

You can press the **Sync Names** button to automatically enter the player names and team names from the replay data. 

You can manually edit the names of the players and teams by clicking in the relevant box and typing the new name. These will be automatically saved.

Use the 1-6 number keys to select a player. 

To start typing a macro, make sure the **Recording Keypresses** notice is visible. Then, start typing the macro according to the Keybinds below. Once you are done, press Enter, and the event will be recorded.

Once you have recorded all of the events you wish to record, the data can be saved in a CSV format by clicking the **Save Events** button.

## Keybinds and Events

### `s` - Shot 

#### Outcomes

- `m` - Miss
- `t` - Save and turnover
- `g` - Leads to goal
- `p` - Pressure retaining

### `g` - Goal

#### Outcomes


- `b` - Beats defender
- `t` - Touched
- `o` - Open net

### `u` - Uncontested Play

#### Outcomes

- `p` - Possession retaining
- `u` - Unclear
- `t` - Uncontested turnover

### `c` - Challenge (50/50)

#### Outcomes

- `n` - Neutral outcome
- `w` - Possession Won
- `l` - Possession Lost

### `f` - First Block

#### Outcomes

- `b` - Ball hit
- `p` - Player hit, no ball contact
- `n` - No player hit, no ball contact

## Secondary values

The **Challenge (50/50)** and **Uncontested Play** events both have secondary values. 

### Challenge (50/50)

Enter the number of the player after the event and outcome in the macro. The secondary player's name will be recorded.

### Uncontested play

When you first press enter, the initial XYZ coordinates of the selected player will be recorded. Continue watching the replay until the play is over, then press enter for a second time to log the XYZ coordinates of the selected player at the end of the play. Both XYZ values will be recorded, with the latter being the secondary value.