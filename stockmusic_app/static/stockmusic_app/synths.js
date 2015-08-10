var castlevania = [
    {
        id: "left",
        ugen: "flock.ugen.tri",
        freq: 261.626,
        mul: 0.2,
    },
    {
        id: "right",
        ugen: "flock.ugen.tri",
        freq: 262,
        mul: 0.3,
    }
];

var user = [
    {
        id: "user",
        ugen: "flock.ugen.saw",
        freq: 261.626/4,
        mul: 0.03,
    }
];

var r2d2 = [
    {
        id: "left",
        ugen: "flock.ugen.saw",
        freq: 261.626,
        mul: 0.05,
        phase: {
           id: "mod",
           ugen: "flock.ugen.sinOsc",
           freq: 34.0,
           mul: {
               ugen: "flock.ugen.sinOsc",
               freq: 1/20,
               mul: flock.PI
           },
           add: flock.PI
        },
    },
    {
        id: "right",
        ugen: "flock.ugen.sinOsc",
        freq: 262,
        mul: 0.2,
        phase: {
           id: "mod",
           ugen: "flock.ugen.sinOsc",
           freq: 3,
           mul: {
               ugen: "flock.ugen.sinOsc",
               freq: 1/3,
               mul: flock.PI
           },
           add: flock.PI
        },
    }
];
