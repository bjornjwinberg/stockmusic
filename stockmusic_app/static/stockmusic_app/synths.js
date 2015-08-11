var synths = {};

synths.castlevania = [
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

synths.threshold = [
    {
        id: "threshold",
        ugen: "flock.ugen.saw",
        freq: 261.626/2,
        mul: 0.3,
    }
];

synths.user = [
    {
        id: "user",
        ugen: "flock.ugen.sinOsc",
        freq: {
            ugen: "flock.ugen.mouse.cursor",
            rate: "control",
            mul: 261.626,
            add: 261.626,
            options: {
                axis: "width",
                target: "body"
            }
        },
        mul: {
            ugen: "flock.ugen.mouse.cursor",
            rate: "control",
            options: {
                axis: "height",
                target: "body"
            },
            mul: 0.2
        }
    }
];




synths.r2d2 = [
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
