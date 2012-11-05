define(['gamejs', 'modules/globals', 'modules/utils', 'gamejs/utils/vectors'], function(gamejs, globals, utils, $v) {
    var size  = [globals.game.screenSize[0], Math.ceil(globals.game.screenSize[1] / 256) * 256];

    /*
     * StarsField.
     * -------------------------------------------------------------------------
     */
    var StarsField = function() {
        //var size  = utils.hypotenuse(globals.game.screenSize);

        this.field1 = new utils.PatternSurface(size);
        this.field2 = new utils.PatternSurface(size);

        this.field1.fillPattern(globals.starsField.image);
        this.field2.fillPattern(globals.starsField.image);

        this.offset1 = [0, 0];
        this.offset2 = [0, -size[1]];

        this.speed = 2;

        // clouds
        this.lowerClouds = new Clouds();
        this.upperClouds = new Clouds(10, [0.5, 1]);

        // meteors
        this.meteors = new Meteors(5);

        // dangling stars
        this.stars = new DanglingStars(30);

        return this;
    };

    StarsField.prototype.draw = function(display) {
        display.blit(this.field1, this.offset1);
        display.blit(this.field2, this.offset2);

        this.lowerClouds.draw(display);
    };

    StarsField.prototype.handle = function(event) {
    };

    StarsField.prototype.update = function(msDuration) {
        this.offset1[1] += this.speed;
        this.offset2[1] += this.speed;

        if (this.offset1[1] >= 0)
            this.offset2[1] = -size[1] + this.offset1[1];
        if (this.offset2[1] >= 0)
            this.offset1[1] = -size[1] + this.offset2[1];

        var time = msDuration / 1000;
        this.lowerClouds.update(time);
        this.upperClouds.update(time);
        this.meteors.update(time);
        this.stars.update(time);
    };


    /*
     * SpaceObjectCollection.
     * this is basically an interface for whichever space object that needs to
     * be generated randomly
     * -------------------------------------------------------------------------
     */
    var SpaceObjectCollection = function(count) {
        count = count || 10;
        this.queue = [];

        // seed the objects
        for (var i = 0; i < count; i++)
            this.queue.push(this.generateNewItem());
        return this;
    };

    SpaceObjectCollection.prototype.draw = function(display) {
        this.queue.forEach(function(item) {
            display.blit(item, item.position);
        });
    };

    SpaceObjectCollection.prototype.update = function(time) {
        var self = this;
        this.queue.forEach(function(item) {
            if (item.position[1] < size[1])
                item.position[1] += item.speed * time;
            else  // this item is off the screen, better "create" a new one.
                self.regenerateItem(item);
        });
    };


    /*
     * CloudsField.
     * -------------------------------------------------------------------------
     */
    var Clouds = function(count, alphaRange) {
        this.maxSpeed = 250;
        this.alphaRange = alphaRange || [0, 1];

        Clouds.superConstructor.apply(this, arguments);

        return this;
    };
    gamejs.utils.objects.extend(Clouds, SpaceObjectCollection);

    Clouds.prototype.generateNewItem = function() {
        var cloud = gamejs.image.load(globals.starsField.cloud);
        cloud = gamejs.transform.scale(cloud, $v.multiply(cloud.getSize(), utils.randomBetween(50, 100) / 100));
        cloud.setAlpha(utils.randomBetween(this.alphaRange[0], this.alphaRange[1], false));
        cloud.position = [Math.random() * size[0] - cloud.getSize()[0] / 2, Math.random() * size[1] - size[1]];
        cloud.speed    = Math.random() * this.maxSpeed;

        return cloud;
    };

    Clouds.prototype.regenerateItem = function(cloud) {
        cloud.position = [Math.random() * size[0] - cloud.getSize()[0] / 2, Math.random() * size[1] - size[1]];
        cloud.speed    = Math.random() * this.maxSpeed;
        cloud.setAlpha(utils.randomBetween(this.alphaRange[0], this.alphaRange[1], false));
    };


    /*
     * Meteor.
     * -------------------------------------------------------------------------
     */
    var Meteors = function(count, alphaRange) {
        this.maxSpeed = 250;
        this.speedRange = alphaRange || [0.5, 1];

        Meteors.superConstructor.apply(this, arguments);

        return this;
    };
    gamejs.utils.objects.extend(Meteors, SpaceObjectCollection);

    Meteors.prototype.generateNewItem = function() {
        var meteor = gamejs.image.load(globals.starsField.meteorBig);
        meteor.position = [Math.random() * size[0] - meteor.getSize()[0] / 2, Math.random() * size[1] - size[1] - 100];
        meteor.speed    = utils.randomBetween(this.speedRange[0], this.speedRange[1], false) * this.maxSpeed;
        return meteor;
    };

    Meteors.prototype.regenerateItem = function(meteor) {
        meteor.position = [Math.random() * size[0] - meteor.getSize()[0] / 2, Math.random() * size[1] - size[1] - 100];
        meteor.speed    = utils.randomBetween(this.speedRange[0], this.speedRange[1], false) * this.maxSpeed;
    };


    /*
     * DanglingStars.
     * -------------------------------------------------------------------------
     */
    var DanglingStars = function(count, alphaRange) {
        this.maxSpeed = 450;
        this.speedRange = alphaRange || [0.7, 1];

        DanglingStars.superConstructor.apply(this, arguments);

        return this;
    };
    gamejs.utils.objects.extend(DanglingStars, SpaceObjectCollection);

    DanglingStars.prototype.generateNewItem = function() {
        var star = gamejs.image.load(globals.starsField.starSmall);
        star.position = [Math.random() * size[0] - star.getSize()[0] / 2, Math.random() * size[1] - size[1]];
        star.speed    = utils.randomBetween(this.speedRange[0], this.speedRange[1], false) * this.maxSpeed;
        return star;
    };

    DanglingStars.prototype.regenerateItem = function(star) {
        star.position = [Math.random() * size[0] - star.getSize()[0] / 2, Math.random() * size[1] - size[1]];
        star.speed    = utils.randomBetween(this.speedRange[0], this.speedRange[1], false) * this.maxSpeed;
    };



    //
    // return the API
    return {
        StarsField: StarsField
    };
});
