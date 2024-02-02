export const events = new Map(Object.entries({
    s: "Shot",
    g: "Goal",
    u: "Uncontested play",
    c: "Challenge (50/50)",
    f: "First block"
}))

export const outcomes = new Map(Object.entries({
    s: new Map(Object.entries({ //shot
        m: "Miss",
        t: "Save and turnover",
        g: "Leads to goal",
        p: "Pressure retaining",
    })),
    g: new Map(Object.entries({ //goal
        b: "Beats defender",
        t: "Touched",
        o: "Open net"
    })),
    u: new Map(Object.entries({ //uncontested play
        p: "Possession retaining",
        u: "Unclear",
        t: "Uncontested turnover"
    })),
    c: new Map(Object.entries({ //challenge or 50/50
        n: "Neutral outcome",
        w: "Possession won",
        l: "Possession Lost"
    })),
    f: new Map(Object.entries({ //first block
        b: "Ball hit",
        p: "Player Hit, no ball contact",
        n: "Player not Hit, no ball contact"
    }))
}))