(function () {

    "use strict";

    fluid.registerNamespace("myStuff");

    var enviro = flock.init();

    var fundamental = 440;

    myStuff.create = function() {
        var mySynth = flock.synth.polyphonic({
            synthDef: {
                id: "carrier",
                ugen: "flock.ugen.tri",
                freq: fundamental,
                mul: {
                    id: "env",
                    ugen: "flock.ugen.asr",
                    attack: 0.1,
                    release: 0.1
                }
            }
        });

        var score = [
            {
                action: "noteOn",
                noteName: "root",
                change: {
                    "carrier.freq": fundamental
                }
            },

            {
                action: "noteOff",
                noteName: "root"
            },

            {
                action: "noteOn",
                noteName: "third",
                change: {
                    "carrier.freq": fundamental * 5/4
                }
            },

            {
                action: "noteOff",
                noteName: "third"
            },

            {
                action: "noteOn",
                noteName: "fifth",
                change: {
                    "carrier.freq": fundamental * 3/2
                }
            },

            {
                action: "noteOff",
                noteName: "fifth"
            },

            {
                action: "noteOn",
                noteName: "seventh",
                change: {
                    "carrier.freq": fundamental * 15/8
                }
            },

            {
                action: "noteOff",
                noteName: "seventh"
            },
        ];
        var clock = flock.scheduler.async();

        var idx = 0;
        clock.repeat(.1, function () {
            if (idx >= score.length) {
                idx = 0;
            }
            var event = score[idx];
            mySynth[event.action](event.noteName, event.change);
            idx++;
        });
        return mySynth;
    };
    myStuff.play = function() {
        enviro.start();
    };
    myStuff.stop = function() {
        enviro.stop();
    };
}());
