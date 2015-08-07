(function () {

    "use strict";

    fluid.registerNamespace("myStuff");

    var enviro = flock.init();

    myStuff.create = function() {
        return flock.synth({
            synthDef: [
                {
                    id: "left",
                    ugen: "flock.ugen.tri",
                    freq: 261.626,
                    mul: 0.2,
                },
                {
                    id: "right",
                    ugen: "flock.ugen.tri",
                    freq: 261.626,
                    mul: 0.2,
                }
            ]
        });
    };

    // myStuff2.create = function() {
    //     return flock.synth({
    //         synthDef: {
    //             id: "carrier",
    //             ugen: "flock.ugen.tri",
    //             freq: 261.626/2,
    //             phase: {
    //                 id: "mod",
    //                 ugen: "flock.ugen.sinOsc",
    //                 freq: 5
    //             },
    //             mul: 0.2
    //         }
    //     });
    // };

    // myStuff.create = function() {
    //     return flock.synth({
    //         synthDef: {
    //             id: "carrier",
    //             ugen: "flock.ugen.tri",
    //             freq: 261.626,
    //             mul: .3
    //         }
    //     });
    // };
    myStuff.play = function () {
        enviro.start();
    };
    myStuff.stop = function () {
        enviro.stop();
    };
}());

// var synth = flock.synth({
//     synthDef: {
//         id: "carrier",
//         ugen: "flock.ugen.sinOsc",
//         freq: 440,
//         phase: {
//             id: "mod",
//             ugen: "flock.ugen.sinOsc",
//             freq: 34.0,
//             mul: {
//                 ugen: "flock.ugen.sinOsc",
//                 freq: 1/20,
//                 mul: Math.PI
//             },
//             add: Math.PI
//         },
//         mul: 0.25
//     }
// });
