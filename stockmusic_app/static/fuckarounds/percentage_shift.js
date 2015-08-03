"use strict";

var dummyData = [100, 200, 50, 75, 150, 75, 7.5]
var increases = []
var decreases = []

for (var i = 0; i < dummyData.length; i++) {
    var currentValue = [];
    var nextValue = [];
    currentValue.push(dummyData[i]);
    nextValue.push(dummyData[i+1]);

    if (isNaN(nextValue[0])) {
        break
    }
    if (currentValue[0] < nextValue[0]) {
        var positiveChange = (nextValue[0] - currentValue[0]) / currentValue[0] * 100
        increases.push(positiveChange)
        console.log(" . . . current value:", currentValue, " . . . next value:", nextValue, " . . . percent increase:", positiveChange)
    } else {
        var negativeChange = (currentValue[0] - nextValue[0]) / currentValue[0] * 100
        decreases.push(negativeChange)
        console.log(" . . . current value:", currentValue, " . . . next value:", nextValue, " . . . percent decrease:", negativeChange)
    };
};

console.log("increases:", increases)
console.log("decreases:", decreases)

var Sum = 0
for (var x = 0; x < increases.length; x ++) {
    Sum = Sum + increases[x];
}
var averageIncrease = Sum / increases.length;
console.log("average increase:", averageIncrease)


var Sum = 0
for (var x = 0; x < decreases.length; x ++) {
    Sum = Sum + decreases[x];
}
var averageDecrease = Sum / decreases.length;
console.log("average decrease:", averageDecrease)
