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
            this.x = Math.random() * this.game.width;
            this.y = Math.random() * this.game.width;
        }
        draw(context) {
            context.beginPath();
            context.arc(this.x, this.y, 50, 0, Math.PI * 2);
            context.stroke();
        }
    }
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            // Asteroid(this) passes Game class to access its width and height
            this.asteroid = new Asteroid(this);
        }
        render(context) {
            this.asteroid.draw(context);
        }
    }
    // construct an instance of Game
    const game = new Game(canvas.width, canvas.height);
    game.render(ctx);
    // function animate() {
    // }
});
//# sourceMappingURL=script.js.map