window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    canvas.width = 600
    canvas.height = 800
    ctx.strokeStyle = 'green'
    ctx.lineWidth = 3
    ctx.font = '20px helvetica'
    ctx.fillStyle = 'orange'

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
                // draw circle
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
                // this.score < this.maxScore && this.score > Math.round(this.maxScore/2)
                if (this.x > this.game.width - this.radius && this.game.score <this.game.maxScore && this.game.score > Math.round(-this.game.maxScore/2)){
                    this.reset()
                    const explosion = this.game.getExplosion()
                    if (explosion) {
                        explosion.start(this.x, this.y, this.speed*-0.2)
                        this.game.score --
                    }
                }
            }
        }

        reset(){
            this.free = true

        }

        start(){
            this.free = false
            this.x = -this.radius
            this.y = Math.random() * this.game.height
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
        animationTimer: number
        animationInterval: number
        sound: HTMLAudioElement

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
            this.frameY = Math.floor(Math.random()*30)
            this.maxFrame = 22
            this.animationTimer = 0
            this.animationInterval = 1000/25 //1000/70 -> about 60FPS of explo animation
            this.sound = this.game.explosionSound
        }
        draw(context: CanvasRenderingContext2D) {
            if (!this.free){
                // context.drawImage(this.image, this.x, this.y)
                context.drawImage(this.image, this.spriteWidth * this.frameX, this.spriteHeight * this.frameY, this.spriteWidth, this.spriteHeight, this.x - this.spriteWidth /2, this.y - this.spriteHeight /2, this.spriteWidth, this.spriteHeight)
            }
        }
        update(deltaTime: number){
            if (!this.free){
                this.x += this.speed
                if (this.animationTimer > this.animationInterval){
                    this.frameX++
                    if (this.frameX > this.maxFrame) {
                        this.reset()
                    }
                    this.animationTimer = 0
                }
                else {
                    this.animationTimer += deltaTime
                }
            }
        }
        play(){
            this.sound.currentTime = 0
            this.sound.play()
        }
        reset(){
            this.free = true
        }
        start(x:number, y:number, speed: number){
            this.free = false
            this.x = x
            this.y = y
            this.frameX = 0
            this.frameY = 0
            this.speed = speed
            this.play()
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
        mouse: {x:number, y:number, radius:number}
        // explosion: Explosion
        score: number
        maxScore: number
        explosionSound: HTMLAudioElement

        constructor(width:number, height:number){
            this.width = width
            this.height = height
            this.asteroidPool = []
            this.maxAsteroids = 2 //can by a dynamic value
            this.asteroidTimer = 1 //time passing for each asteroid
            this.asteroidInterval = 1 //time limit
            this.explosionPool = []
            this.maxExplosions = 9 //can by a dynamic value
            this.score = 0
            this.maxScore = 10
            this.mouse = {
                x: 0,
                y: 0,
                radius: 2,
            }
            this.explosionSound = document.getElementById('explosion5') as HTMLAudioElement
            this.explosionSound.volume = 0.1 // volume lowered
            this.createAsteroidPool()
            this.createExplosionPool()
            // console.log('this.explosionSound ' + this.explosionSound)

            // Arrow function inherits 'this' keyword from the parents scope
            // 'this' will be inherited from a class it was defined in. 
            // In this case it will point to a main game object and will have its methods
            window.addEventListener('click', event => {
                this.mouse.x = event.offsetX
                this.mouse.y = event.offsetY
                this.asteroidPool.forEach(asteroid => {
                    if (!asteroid.free && this.checkCollision(asteroid, this.mouse)){
                        const explosion = this.getExplosion()
                        if (explosion) {
                            explosion.start(asteroid.x, asteroid.y, asteroid.speed*0.4)
                            asteroid.reset()
                            if(this.score < this.maxScore && this.score > Math.round(-this.maxScore/2)){
                                this.score++
                            }
                        }
                    }
                })
            })
        }
        //a pool of active and inactiev objects
        createAsteroidPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.asteroidPool.push(new Asteroid(this))
            }
        }

        createExplosionPool() {
            for (let i = 0; i < this.maxExplosions; i++) {
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
        //between circles
        checkCollision(a:Asteroid,b:any){
            const sumOfRadii = a.radius + b.radius
            const dx = a.x - b.x
            const dy = a.y - b.y
            const distance = Math.hypot(dx, dy) // hypot returns the square root of the sum of squares of its arguments.
            return distance < sumOfRadii //return false or true
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
                explosion.update(deltaTime)
            })
            context.fillText('SCORE: ' + this.score, 20, 30)
            if (this.score >= this.maxScore){
                context.save()
                context.textAlign = 'center'
                context.fillText('You won, reaching ' + this.score + ' points', this.width/2, this.height/2)
                context.restore()
            }
            
            if (this.score <= Math.round(-this.maxScore/2)){
                context.save()
                context.textAlign = 'center'
                context.fillText('Universe is quite dead.', this.width/2, this.height/2)
                context.restore()
            }

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
        // console.log(Math.floor(1000/deltaTime)) //FPS
        requestAnimationFrame(animate)
    }
    //run animation loop, first time stamp as argument
    animate(0)
})