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
        radius: number
        x: number
        y: number
        image: CanvasImageSource
        spriteWidth: number
        spriteHeight: number
        speed: number
        free: boolean
        angle: number
        angleChange: number

        constructor(game:Game){
            //accessible game object
            this.game = game
            this.radius = 75
            this.x = -this.radius //to hide it on spawn
            this.y = Math.random()* this.game.width
            this.image = document.getElementById('asteroid') as CanvasImageSource
            this.spriteWidth = 150
            this.spriteHeight = 150
            this.speed = 1 + Math.random()
            // free to use in object pool, not animated
            this.free = true
            this.angle = 0
            this.angleChange = 0.025 - Math.random() * 0.05
        }

        draw(context:CanvasRenderingContext2D){
            if (!this.free){
                //draw circle
                // context.beginPath()
                // context.arc(this.x, this.y, this.radius, 0, Math.PI *2)
                // context.stroke()
                context.save()
                context.translate(this.x, this.y)
                context.rotate(this.angle)
                //draw source image
                context.drawImage(this.image, 0 - this.spriteWidth/2, 0 - this.spriteHeight/2, this.spriteWidth, this.spriteHeight)
                context.restore()
            }

        }

        update(){
            this.angle += 0.001 + this.angleChange
            if (!this.free){
                this.x += this.speed
                if (this.x > this.game.width + this.radius){
                    this.reset()
                }
            }
        }

        reset(){
            this.free = true
            this.x = -this.radius
            this.y = Math.random() * this.game.height
        }

        start(){
            this.free = false
        }
    }

    //objects will be reused. Instead of being created and deleted they are just turned back to the initial state. Therefore garbage collection wont even have to happen.
    class Game {
        width: number
        height: number
        // asteroid: Asteroid
        asteroidPool: Asteroid[]
        maxAsteroids: number
        asteroidTimer: number
        asteroidInterval: number

        constructor(width:number, height:number){
            this.width = width
            this.height = height
            this.asteroidPool = []
            this.maxAsteroids = 10 //can by a dynamic value
            this.asteroidTimer = 0
            this.asteroidInterval = 1000
            this.createAsteroidPool()
        }
        //a pool of active and inactiev objects
        createAsteroidPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.asteroidPool.push(new Asteroid(this))
            }
        }

        getElement() {
            for (let i=0;  i< this.asteroidPool.length; i++){
                if (this.asteroidPool[i].free){
                    return this.asteroidPool[i]
                }
            }
            return //silences TS empty code paths error
        }

        render(context:CanvasRenderingContext2D, deltaTime:number){
            //create asteroid periodically
            if (this.asteroidTimer > this.asteroidInterval){
                const asteroid = this.getElement()
                asteroid?.start()
                //add new Asteroid
                this.asteroidTimer = 0
            } else {
                this.asteroidTimer += deltaTime
            }
            this.asteroidPool.forEach( asteroid => {
                asteroid.draw(context)
                asteroid.update()
            })
            // this.asteroid.draw(context)
        }
    }

    // construct an instance of Game
    const game = new Game(canvas.width, canvas.height)
    
    let lastTime = 0
    function animate(timeStamp: number) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        // console.log(timeStamp)
        ctx.clearRect(0,0, canvas.width, canvas.height)
        game.render(ctx, deltaTime)
        // console.log(1000/deltaTime)
        // console.log(deltaTime)
        requestAnimationFrame(animate)
    }
    //run animation loop, first time stamp as argument
    animate(0)
})