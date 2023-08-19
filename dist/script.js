"use strict";
console.log('ok lets gooo');
window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 800;
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 3;
    class Asteroid {
        constructor(game) {
            //accessible game object
            this.game = game;
            this.radius = 75; //18:33
            this.x = -this.radius; //to hide it on spawn
            this.y = Math.random() * this.game.width;
            this.image = document.getElementById('asteroid');
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.speed = 1 + Math.random();
            // free to use in object pool, not animated
            this.free = true;
        }
        draw(context) {
            if (!this.free) {
                context.beginPath();
                context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                context.stroke();
                //draw source image
                context.drawImage(this.image, this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2, this.spriteWidth, this.spriteHeight);
            }
        }
        update() {
            if (!this.free) {
                this.x += this.speed;
                if (this.x > this.game.width + this.radius) {
                    this.reset();
                }
            }
        }
        reset() {
            this.free = true;
            this.x = -this.radius;
            this.y = Math.random() * this.game.height;
        }
        start() {
            this.free = false;
        }
    }
    //objects will be reused. Instead of being created and deleted they are just turned back to the initial state. Therefore garbage collection wont even have to happen.
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.asteroidPool = [];
            this.maxAsteroids = 10; //can by a dynamic value
            this.asteroidTimer = 0;
            this.asteroidInterval = 1000;
            this.createAsteroidPool();
        }
        //a pool of active and inactiev objects
        createAsteroidPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.asteroidPool.push(new Asteroid(this));
            }
        }
        getElement() {
            for (let i = 0; i < this.asteroidPool.length; i++) {
                if (this.asteroidPool[i].free) {
                    return this.asteroidPool[i];
                }
            }
            return; //silences TS empty code paths error
        }
        render(context, deltaTime) {
            //create asteroid periodically
            if (this.asteroidTimer > this.asteroidInterval) {
                const asteroid = this.getElement();
                asteroid === null || asteroid === void 0 ? void 0 : asteroid.start();
                //add new Asteroid
                this.asteroidTimer = 0;
            }
            else {
                this.asteroidTimer += deltaTime;
            }
            this.asteroidPool.forEach(asteroid => {
                asteroid.draw(context);
                asteroid.update();
            });
            // this.asteroid.draw(context)
        }
    }
    // construct an instance of Game
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // console.log(timeStamp)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        // console.log(1000/deltaTime)
        // console.log(deltaTime)
        requestAnimationFrame(animate);
    }
    //run animation loop, first time stamp as argument
    animate(0);
});
//# sourceMappingURL=script.js.map