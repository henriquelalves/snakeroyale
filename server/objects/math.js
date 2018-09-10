let GameMath = function () {
    var wrap = function (value, min, max) {
        var range = max - min;
        if (range <= 0) {
            return 0;
        }
        var result = (value - min) % range;
        if (result < 0) {
            result += range;
        }
        return result + min;
    }

    var between = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    return {
        wrap: wrap,
        between: between,
    }
}();

module.exports = GameMath;