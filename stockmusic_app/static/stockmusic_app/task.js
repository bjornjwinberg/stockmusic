"use strict"

function sleep(speed) {
    var now = Date.now();
    var later = now+speed
    while (true) {
        if (Date.now() >= later) {
            return true
        };
    };
};

self.addEventListener('message', function(e) {
    var notes = e.data[0];
    var speed = e.data[1];
    for(var i = 0; i < notes.length; i++) {
        self.postMessage([notes[i], i])
        sleep(speed)
    };
}, false);
