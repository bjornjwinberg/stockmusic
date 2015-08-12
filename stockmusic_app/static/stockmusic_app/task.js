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
    var songLength = e.data[0];
    var speed = e.data[1];
    for(var i = 0; i < songLength; i++) {
        self.postMessage([i])
        sleep(speed)
    };
}, false);
