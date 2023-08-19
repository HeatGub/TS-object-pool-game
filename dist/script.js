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
            this.x = Math.random() * this.game.width;
            this.y = Math.random() * this.game.width;
            this.image = document.getElementById('asteroid');
            this.spriteWidth = 150;
            this.spriteHeight = 150;
        }
        draw(context) {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();
            //draw source image
            context.drawImage(this.image, this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2, this.spriteWidth, this.spriteHeight);
        }
    }
    //objects will be reused. Instead of being created and deleted they are just turned back to the initial state. Therefore garbage collection wont even have to happen.
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.asteroidPool = [];
            this.maxAsteroids = 10; //can by a dynamic value
            this.createAsteroidPool();
        }
        //a pool of active and inactiev objects
        createAsteroidPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.asteroidPool.push(new Asteroid(this));
            }
        }
        render(context) {
            this.asteroidPool.forEach(asteroid => asteroid.draw(context));
            // this.asteroid.draw(context)
        }
    }
    // construct an instance of Game
    const game = new Game(canvas.width, canvas.height);
    game.render(ctx);
    // function animate() {
    // }
});
//# sourceMappingURL=script.js.map