var synths = {};

synths.sine = [
    {
        id: "left",
        ugen: "flock.ugen.sinOsc",
        freq: 261.626,
        mul: 0.35
    },
    {
        id: "right",
        ugen: "flock.ugen.sinOsc",
        freq: 261.626,
        mul: 0.35
    }
];

synths.wobbly = [
    {
        id: "left",
        ugen: "flock.ugen.saw",
        freq: 0,
        mul: 0.1,
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
        }
    },
    {
        id: "right",
        ugen: "flock.ugen.sinOsc",
        freq: 0,
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
        }
    }
];

synths.nintendo = [
    {
        id: "left",
        ugen: "flock.ugen.tri",
        freq: 0,
        mul: 0.35
    },
    {
        id: "right",
        ugen: "flock.ugen.tri",
        freq: 0,
        mul: 0.35
    }
];

synths.rotator = [
    {
        id: "left",
        ugen: "flock.ugen.tri",
        freq: 0,
        mul: {
            ugen: "flock.ugen.sinOsc",
            freq: 3
        }
    },
    {
        id: "right",
        ugen: "flock.ugen.tri",
        freq: 0,
        mul: {
            ugen: "flock.ugen.sinOsc",
            freq: 2
        }
    }
];

synths.positiveThreshold = [
    {
        id: "positiveThreshold",
        ugen: "flock.ugen.sinOsc",
        freq: {
            ugen: "flock.ugen.xLine",
            rate: "control",
            duration: 1.0,
            start: 261.626,
            end: 1050.504
        },
        mul: 0.2
    }
];

synths.negativeThreshold = [
    {
        id: "negativeThreshold",
        ugen: "flock.ugen.sinOsc",
        freq: {
            ugen: "flock.ugen.xLine",
            rate: "control",
            duration: 1.0,
            start: 1050.504,
            end: 261.626
        },
        mul: 0.2
    }
];

synths.user = [
    {
        id: "user",
        ugen: "flock.ugen.sinOsc",
        freq: {
            ugen: "flock.ugen.mouse.cursor",
            rate: "control",
            mul: 391.995,
            add: 130.813,
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
            mul: 0.3
        }
    }
];
