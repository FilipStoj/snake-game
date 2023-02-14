import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

createApp(App).mount('#app')




/*{ <template>
<div id="game-board">
    <!-- Canvas to render the game board -->
    <canvas ref="canvas" id="snake-canvas" width="350" height="350"></canvas>

    <!-- Display for the current score -->
    <div id="score">Current Score: {{ score }}</div>

    <!-- Display for the time elapsed-->
    <div id="timer">Time Elapsed: {{ time }} seconds</div>

    <button id="start-btn" @click="startGame">{{ paused ? 'Play' : 'Pause'}}</button>
</div>
</template>

<script>
export default {
name: 'Board',
data() {
    return {
        score: 0,
        time: 0,
        timer: null,
        paused: true,
        gameStarted: false,
        snake: {
            x: 150,
            y: 150,
            dx: 10,
            dy: 0,
            cells: [
                {x: 150, y: 150}],
            maxCells: 4
        },
    }
},

methods: {
    startGame() {

    // Toggle the paused state    
    this.paused = !this.paused;

    // If the game is paused, clear the timer and the timeTimer
    if (this.paused) {
        clearInterval(this.timer);
        clearInterval(this.timeTimer);
        this.timer = null;
        this.timeTimer = null;
    } else { 
        // If the game is not paused, start the game
        if (!this.gameStarted) {

      // Get the canvas element and its context
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");

      // Load the images
      const ground = new Image();
      ground.src = "/src/assets/gameElements/ground.png";
      const apple = new Image();
      apple.src = "/src/assets/gameElements/apple.png";

    // Draw the ground
      ground.onload = () => {
        ctx.drawImage(ground, 0, 0, 350, 350);
      };

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set the game to true
      this.gameStarted = true;

    // Add the event listener for the keydown event
      document.addEventListener("keydown", this.handleKeydown);
    }

    // Start the game loop
    this.timer = setInterval(() => {
      this.update();
    }, 200);

    // Add the new interval to the timer
    this.timeTimer = setInterval(() => {
            this.time += 1;
    }, 1000);
  }
},
update() {
   

    for (let i = this.snake.cells.length - 1; i > 0; i--) {
        this.snake.cells[i].x = this.snake.cells[i - 1].x;
        this.snake.cells[i].y = this.snake.cells[i - 1].y;
    }

    this.snake.cells[0].x = this.snake.x;
    this.snake.cells[0].y = this.snake.y;

    // Redraw the snake on the canvas
    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    for(const cell of this.snake.cells) {
        ctx.fillRect(cell.x, cell.y, 10, 10);
    }
},
    handleKeydown(event) {
        // Get the key pressed
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.snake.dx = 0;
                this.snake.dy = -10;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.snake.dx = 0;
                this.snake.dy = 10;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.snake.dx = -10;
                this.snake.dy = 0;
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.snake.dx = 10;
                this.snake.dy = 0;
                break;}
    }
}
}
</script>

<style>
#game-board {
display: grid;
place-items: center;
}

#snake-canvas {
border: 1px solid #ccc;
background-color: #f5f5f5;
margin-top: 1rem;
}

#start-btn {
margin-top: 1rem;
padding: 0.5rem 1rem;
font-size: 1rem;
border: 1px solid #ccc;
border-radius: 3px;
background-color: #fff;
cursor: pointer;
}
</style> */