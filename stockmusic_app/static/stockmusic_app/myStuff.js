(function () {

    "use strict";

    fluid.registerNamespace("myStuff");

    var enviro = flock.init();

    myStuff.create = function() {
        return flock.synth({
            synthDef: {
                id: "carrier",
                ugen: "flock.ugen.tri",
                freq: 261.626,
                mul: .3
            }
        });
    }
    myStuff.play = function () {
        enviro.start();
    };
    myStuff.stop = function () {
        enviro.stop();
    };
}());


        // // A 24db low pass moog-style filter.
        // var synth = flock.synth({
        //     synthDef: {
        //         ugen: "flock.ugen.filter.moog",
                // cutoff: {
                //     ugen: "flock.ugen.sinOsc",
                //     freq: 1/4,
                //     mul: 5000,
                //     add: 7000
                // },
        //         resonance: {
        //             ugen: "flock.ugen.sinOsc",
        //             freq: 1/2,
        //             mul: 1.5,
        //             add: 1.5
        //         },
        //         source: {
        //             ugen: "flock.ugen.lfSaw",
        //             freq: {
        //                 ugen: "flock.ugen.sequence",
        //                 freq: 10,
        //                 loop: 1,
        //                 list: [261.626, 293.665, 329.628, 349.228, 391.995, 440.000, 493.883],
        //                 options: {
        //                     interpolation: "linear"
        //                 }
        //             }
        //         },
        //         mul: 0.5
        //     }
        // });
