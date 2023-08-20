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
            this.y = Math.random()* this.game.height
            this.image = document.getElementById('asteroid') as CanvasImageSource
            this.spriteWidth = 150
            this.spriteHeight = 150
            this.speed = 5 + Math.random()*5
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
            if (!this.free){
                this.angle += 0.001 + this.angleChange
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

    class Explosion {
        game: Game
        x: number
        y: number
        speed: number
        image: CanvasImageSource
        spriteWidth: number
        spriteHeight: number
        free: boolean
        frameX: number
        frameY: number
        maxFrame: number

        constructor(game: Game){
            this.game = game
            this.x = 0
            this.y = 0
            this.speed = 0
            this.image = document.getElementById('explosions') as CanvasImageSource
            this.spriteWidth = 300
            this.spriteHeight = 300
            this.free = true
            this.frameX = 0
            this.frameY = Math.floor(Math.random()*3)
            this.maxFrame = 22
        }
        draw(context: CanvasRenderingContext2D) {
            if (!this.free){
                context.drawImage(this.image, this.x, this.y)
            }
        }
        update(){
            if (!this.free){
                
            }
        }
        reset(){
            this.free = true
        }
        start(x:number, y:number){
            this.free = false
            this.x = x
            this.y = y
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
        explosionPool: Explosion []
        maxExplosions: number
        mouse: {x:number, y:number}
        // explosion: Explosion

        constructor(width:number, height:number){
            this.width = width
            this.height = height
            this.asteroidPool = []
            this.maxAsteroids = 20 //can by a dynamic value
            this.asteroidTimer = 1 //time passing for each asteroid
            this.asteroidInterval = 1 //time limit
            this.createAsteroidPool()
            this.explosionPool = []
            this.maxExplosions = 10 //can by a dynamic value
            this.createExplosionPool()


            this.mouse = {
                x: 0,
                y: 0
            }


            // Arrow function inherits 'this' keyword from the parents scope
            // 'this' will be inherited from a class it was defined in. 
            // In this case it will point to a main game object and will have its methods
            window.addEventListener('click', event => {
                this.mouse.x = event.offsetX
                this.mouse.y = event.offsetY
                const explosion = this.getExplosion()
                if (explosion) {
                    explosion.start(this.mouse.x, this.mouse.y)
                }
            })
        }
        //a pool of active and inactiev objects
        createAsteroidPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.asteroidPool.push(new Asteroid(this))
            }
        }

        createExplosionPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.explosionPool.push(new Explosion(this))
            }
        }

        getAsteroid() {
            for (let i=0;  i< this.asteroidPool.length; i++){
                if (this.asteroidPool[i].free){
                    return this.asteroidPool[i]
                }
            }
            return //silences TS empty code paths error
        }

        getExplosion() {
            for (let i=0;  i< this.explosionPool.length; i++){
                if (this.explosionPool[i].free){
                    return this.explosionPool[i]
                }
            }
            return //silences TS empty code paths error
        }

        render(context:CanvasRenderingContext2D, deltaTime:number){
            //create asteroid periodically
            if (this.asteroidTimer > this.asteroidInterval){
                const asteroid = this.getAsteroid()
                //add new Asteroid
                asteroid?.start()
                this.asteroidTimer = 0
            } else {
                this.asteroidTimer += deltaTime
            }
            this.asteroidPool.forEach( asteroid => {
                asteroid.draw(context)
                asteroid.update()
            })
            this.explosionPool.forEach( explosion => {
                explosion.draw(context)
                explosion.update()
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
        ctx.clearRect(0,0, canvas.width, canvas.height)
        game.render(ctx, deltaTime)
        // console.log(Math.floor(1000/deltaTime))
        requestAnimationFrame(animate)
    }
    //run animation loop, first time stamp as argument
    animate(0)
})