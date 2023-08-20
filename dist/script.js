"use strict";
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
            this.radius = 75;
            this.x = -this.radius; //to hide it on spawn
            this.y = Math.random() * this.game.height;
            this.image = document.getElementById('asteroid');
            this.spriteWidth = 150;
            this.spriteHeight = 150;
            this.speed = 5 + Math.random() * 5;
            // free to use in object pool, not animated
            this.free = true;
            this.angle = 0;
            this.angleChange = 0.025 - Math.random() * 0.05;
        }
        draw(context) {
            if (!this.free) {
                //draw circle
                // context.beginPath()
                // context.arc(this.x, this.y, this.radius, 0, Math.PI *2)
                // context.stroke()
                context.save();
                context.translate(this.x, this.y);
                context.rotate(this.angle);
                //draw source image
                context.drawImage(this.image, 0 - this.spriteWidth / 2, 0 - this.spriteHeight / 2, this.spriteWidth, this.spriteHeight);
                context.restore();
            }
        }
        update() {
            if (!this.free) {
                this.angle += 0.001 + this.angleChange;
                this.x += this.speed;
                if (this.x > this.game.width - this.radius) {
                    this.reset();
                    const explosion = this.game.getExplosion();
                    if (explosion) {
                        explosion.start(this.x, this.y);
                    }
                }
            }
        }
        reset() {
            this.free = true;
        }
        start() {
            this.free = false;
            this.x = -this.radius;
            this.y = Math.random() * this.game.height;
        }
    }
    class Explosion {
        constructor(game) {
            this.game = game;
            this.x = 0;
            this.y = 0;
            this.speed = 0;
            this.image = document.getElementById('explosions');
            this.spriteWidth = 300;
            this.spriteHeight = 300;
            this.free = true;
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 30);
            this.maxFrame = 22;
            this.animationTimer = 0;
            this.animationInterval = 1000 / 25; //1000/70 -> about 60FPS of explo animation
        }
        draw(context) {
            if (!this.free) {
                // context.drawImage(this.image, this.x, this.y)
                context.drawImage(this.image, this.spriteWidth * this.frameX, this.spriteHeight * this.frameY, this.spriteWidth, this.spriteHeight, this.x - this.spriteWidth / 2, this.y - this.spriteHeight / 2, this.spriteWidth, this.spriteHeight);
            }
        }
        update(deltaTime) {
            if (!this.free) {
                if (this.animationTimer > this.animationInterval) {
                    this.frameX++;
                    if (this.frameX > this.maxFrame) {
                        this.reset();
                    }
                    this.animationTimer = 0;
                }
                else {
                    this.animationTimer += deltaTime;
                }
            }
        }
        reset() {
            this.free = true;
        }
        start(x, y) {
            this.free = false;
            this.x = x;
            this.y = y;
            this.frameX = 0;
            this.frameY = 0;
        }
    }
    //objects will be reused. Instead of being created and deleted they are just turned back to the initial state. Therefore garbage collection wont even have to happen.
    class Game {
        // explosion: Explosion
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.asteroidPool = [];
            this.maxAsteroids = 20; //can by a dynamic value
            this.asteroidTimer = 1; //time passing for each asteroid
            this.asteroidInterval = 1; //time limit
            this.createAsteroidPool();
            this.explosionPool = [];
            this.maxExplosions = 30; //can by a dynamic value
            this.createExplosionPool();
            this.mouse = {
                x: 0,
                y: 0
            };
            // Arrow function inherits 'this' keyword from the parents scope
            // 'this' will be inherited from a class it was defined in. 
            // In this case it will point to a main game object and will have its methods
            window.addEventListener('click', event => {
                this.mouse.x = event.offsetX;
                this.mouse.y = event.offsetY;
                const explosion = this.getExplosion();
                if (explosion) {
                    explosion.start(this.mouse.x, this.mouse.y);
                }
            });
        }
        //a pool of active and inactiev objects
        createAsteroidPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.asteroidPool.push(new Asteroid(this));
            }
        }
        createExplosionPool() {
            for (let i = 0; i < this.maxExplosions; i++) {
                this.explosionPool.push(new Explosion(this));
            }
        }
        getAsteroid() {
            for (let i = 0; i < this.asteroidPool.length; i++) {
                if (this.asteroidPool[i].free) {
                    return this.asteroidPool[i];
                }
            }
            return; //silences TS empty code paths error
        }
        getExplosion() {
            for (let i = 0; i < this.explosionPool.length; i++) {
                if (this.explosionPool[i].free) {
                    return this.explosionPool[i];
                }
            }
            return; //silences TS empty code paths error
        }
        render(context, deltaTime) {
            //create asteroid periodically
            if (this.asteroidTimer > this.asteroidInterval) {
                const asteroid = this.getAsteroid();
                //add new Asteroid
                asteroid === null || asteroid === void 0 ? void 0 : asteroid.start();
                this.asteroidTimer = 0;
            }
            else {
                this.asteroidTimer += deltaTime;
            }
            this.asteroidPool.forEach(asteroid => {
                asteroid.draw(context);
                asteroid.update();
            });
            this.explosionPool.forEach(explosion => {
                explosion.draw(context);
                explosion.update(deltaTime);
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        // console.log(Math.floor(1000/deltaTime)) //FPS
        requestAnimationFrame(animate);
    }
    //run animation loop, first time stamp as argument
    animate(0);
});
//# sourceMappingURL=script.js.map