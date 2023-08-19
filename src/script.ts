console.log('ok lets gooo')

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = 600
    canvas.height = 800
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 3

    class Asteroid {
        game: Game
        x: number
        y: number
        constructor(game:Game){
            //accessible game object
            this.game = game
            this.x = Math.random()* this.game.width
            this.y = Math.random()* this.game.width
        }
        draw(context:CanvasRenderingContext2D){
            context.beginPath()
            context.arc(this.x, this.y, 50, 0, Math.PI *2)
            context.stroke()
        }
    }

    //objects will be reused. Instead of being created and deleted they are just turned back to the initial state. Therefore garbage collection wont even have to happen.
    class Game {
        width: number
        height: number
        // asteroid: Asteroid
        asteroidPool: Asteroid[]
        maxAsteroids: number

        constructor(width:number, height:number){
            this.width = width
            this.height = height
            this.asteroidPool = []
            this.maxAsteroids = 10 //can by a dynamic value
            this.createAsteroidPool()
        }
        //a pool of active and inactiev objects
        createAsteroidPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.asteroidPool.push(new Asteroid(this))
            }
        }

        render(context:CanvasRenderingContext2D){
            this.asteroidPool.forEach( asteroid =>
                asteroid.draw(context)
            )
            // this.asteroid.draw(context)
        }
    }

    // construct an instance of Game
    const game = new Game(canvas.width, canvas.height)
    game.render(ctx)

    // function animate() {

    // }
})