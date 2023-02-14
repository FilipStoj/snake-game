<template>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col-md-8">
        <div id="game-board" class="text-center">
          <canvas
            ref="canvas"
            id="snake-canvas"
            width="350"
            height="350"
            style="background-image: url('/src/assets/gameElements/ground.png')"
          ></canvas>
          <div id="score">Current Score: {{ score }}</div>
          <div id="timer">Time: {{ time }} seconds</div>
          <div id="buttons-container">
            <button id="start-btn" @click="startGame">
              {{ paused ? "Play" : "Pause" }}
            </button>
            <button id="restart-btn" @click="resetGame">Restart</button>
          </div>
          <div id="game-over" class="mt-3" style="display: none">
            Game Over!
          </div>
        </div>
      </div>
      <!-- Highscore section -->
      <div class="col-md-4">
        <h2>Highscores</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Time Used</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loop through the highscores and display them -->
            <tr v-for="score in highScores" :key="score.id">
              <td>{{ score.name }}</td>
              <td>{{ score.score }}</td>
              <td>{{ score.time }} sec</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import db from "@/firebase/firebaseInit.js";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
} from "firebase/firestore";

export default {
  name: "Board",
  data() {
    return {
      score: 0,
      name: "",
      time: 0,
      timer: null,
      paused: true,
      gameStarted: false,
      highScores: [],
      snake: {
        x: 150,
        y: 150,
        dx: 10,
        dy: 0,
        cells: [{ x: 150, y: 150 }],
        maxCells: 4,
      },
      apple: {
        x: 100,
        y: 100,
      },
    };
  },
  created() {
    // Get the highscores from the database
    const scoresRef = collection(db, "highscores");
    const q = query(scoresRef, orderBy("score", "desc"), limit(10));
    onSnapshot(q, (querySnapshot) => {
      this.highScores = querySnapshot.docs.map((doc) => doc.data());
    });
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
          this.startGameSound();

          // Get the canvas element and its context
          const canvas = this.$refs.canvas;
          const ctx = canvas.getContext("2d");

          // Set the game to true
          this.gameStarted = true;

          // Set the initial direction of the snake
          this.snake.dx = 10;
          this.snake.dy = 0;

          // Generate a new random location for the apple
          this.apple.x =
            Math.floor((Math.random() * (canvas.width - 10)) / 10) * 10;
          this.apple.y =
            Math.floor((Math.random() * (canvas.height - 10)) / 10) * 10;

          // Add the event listener for the keydown event
          document.addEventListener("keydown", this.handleKeydown);
        }

        // Start the game loop
        this.timer = setInterval(() => {
          this.update();
          if (this.checkCollision()) {
            clearInterval(this.timer);
            clearInterval(this.timeTimer);
          }
        }, 100);

        // Add the new interval to the timer
        this.timeTimer = setInterval(() => {
          this.time += 1;
        }, 1000);
      }
    },
    drawApple() {
      // Draw the apple on the canvas
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "pink";
      ctx.fillRect(this.apple.x, this.apple.y, 10, 10);
    },
    update() {
      // Check if the snake has collided
      this.checkCollision();

      // Update the snake's position
      this.snake.x += this.snake.dx;
      this.snake.y += this.snake.dy;

      // Add new cell to the snake's body if it has collided with the apple
      if (this.snake.cells.length < this.snake.maxCells) {
        this.snake.cells.unshift({ x: this.snake.x, y: this.snake.y });
      } else {
        this.snake.cells.pop();
        this.snake.cells.unshift({ x: this.snake.x, y: this.snake.y });
      }

      // Call the function to render the game board
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Call the function to draw the apple
      this.drawApple();

      // Call the function to draw the snake
      ctx.fillStyle = "red";
      this.snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, 10, 10);
      });
    },
    checkCollision() {
      // Check if the snake has collided with the wall
      if (
        this.snake.x < 0 ||
        this.snake.x >= this.$refs.canvas.width ||
        this.snake.y < 0 ||
        this.snake.y >= this.$refs.canvas.height
      ) {
        document.getElementById("game-over").style.display = "block";
        this.gameOverSound();
        this.submitScore();
        return true;
      }

      // Check if the snake has collided with itself
      for (let i = 0; i < this.snake.cells.length; i++) {
        if (
          i !== 0 &&
          this.snake.x === this.snake.cells[i].x &&
          this.snake.y === this.snake.cells[i].y
        ) {
          document.getElementById("game-over").style.display = "block";
          this.gameOverSound();
          this.submitScore();
          return true;
        }
      }

      // Check if the snake has collided with the apple
      if (this.snake.x === this.apple.x && this.snake.y === this.apple.y) {
        // Generate a new random location for the apple
        const canvas = this.$refs.canvas;
        this.apple.x =
          Math.floor((Math.random() * (canvas.width - 10)) / 10) * 10;
        this.apple.y =
          Math.floor((Math.random() * (canvas.height - 10)) / 10) * 10;

        // Increase the snake's maxCells by 1
        this.snake.maxCells++;
        this.eatSound();

        // Increase the player's score by 1
        this.score++;
      }
      return false;
    },
    startGameSound() {
      // Play the start game sound
      const audio = new Audio("src/assets/gameSound/start.wav");
      audio.play();
    },
    eatSound() {
      // Play the eat sound
      const audio = new Audio("src/assets/gameSound/eat.wav");
      audio.play();
    },
    gameOverSound() {
      // Play the game over sound
      const audio = new Audio("src/assets/gameSound/gameOver.wav");
      audio.play();
    },
    async submitScore() {
      // Ask the user to enter their name before submitting the score
      const name = window.prompt("Please enter your name");

      // Only proceed with submitting the score if the user entered a name
      if (name) {
        // Submit the player's score to the database
        const scoresRef = collection(db, "highscores");
        await addDoc(scoresRef, {
          name,
          score: this.score,
          time: this.time,
        });
        this.resetGame();
      }
    },
    resetGame() {
      // Reset the game and hide the game over message
      this.score = 0;
      this.time = 0;
      this.gameStarted = false;
      this.paused = true;
      this.snake = {
        x: 150,
        y: 150,
        dx: 10,
        dy: 0,
        cells: [{ x: 150, y: 150 }],
        maxCells: 4,
      };
      this.apple = {
        x: Math.floor(Math.random() * 34) * 10,
        y: Math.floor(Math.random() * 34) * 10,
      };
      this.timer = null;
      this.timeTimer = null;
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawApple();
      ctx.fillStyle = "red";
      this.snake.cells.forEach((cell, index) => {
        ctx.fillRect(cell.x, cell.y, 10, 10);
      });
      document.getElementById("game-over").style.display = "none";
    },
    handleKeydown(event) {
      event.preventDefault();
      // Get the key pressed
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          this.snake.dx = 0;
          this.snake.dy = -10;
          break;
        case "ArrowDown":
        case "KeyS":
          this.snake.dx = 0;
          this.snake.dy = 10;
          break;
        case "ArrowLeft":
        case "KeyA":
          this.snake.dx = -10;
          this.snake.dy = 0;
          break;
        case "ArrowRight":
        case "KeyD":
          this.snake.dx = 10;
          this.snake.dy = 0;
          break;
      }
    },
  },
};
</script>

<style>
#game-board {
  display: grid;
  place-items: center;
}

#game-board button {
  display: inline-block;
  margin: 1rem;
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

#restart-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #fff;
  cursor: pointer;
}
</style>
