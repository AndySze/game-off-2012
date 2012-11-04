define(['gamejs'], function(gamejs) {
    var PatternSurface = gamejs.Surface;
    PatternSurface.prototype.fillPattern = function(imgUrl) {
        var image = gamejs.image.loadImage(imgUrl);
        this.fill(this.context.createPattern(image, 'repeat'));
    };

    var hypotenuse = function() {
        if (arguments.length == 1)
            arguments = arguments[0];
        var x = arguments[0],
            y = arguments[1];
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    };

    return {
        hypotenuse: hypotenuse,
        PatternSurface: PatternSurface
    };
});