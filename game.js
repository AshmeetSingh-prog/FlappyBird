import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5Q80mGifPD8PDNRUi1nHqX1CpAN39ujs",
    authDomain: "farty-81f96.firebaseapp.com",
    databaseURL: "https://project-44037-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "farty-81f96",
    storageBucket: "farty-81f96.firebasestorage.app",
    messagingSenderId: "418284906503",
    appId: "1:418284906503:web:f64a389de75ed7764b22a2"
};
const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);

// Canvas Setup
let canvas = document.getElementById("canvas");
let scoreDiv = document.getElementById("score");
let scoreFontSize = parseInt(window.getComputedStyle(scoreDiv).fontSize.replace("px", ""), 10);
canvas.height = window.innerHeight - scoreFontSize * 2;
canvas.width = window.innerWidth;
canvas.style.backgroundColor = "yellow";

let playerName = localStorage.getItem("playername") || "Guest";
let GameOver = false;
let score = 0;
let maxScore = 0;
scoreDiv.innerHTML = `Score: ${score}`;

// Images
let birdImg = new Image();
birdImg.src = 'bird2.png';

let backgroundImg = new Image();
backgroundImg.src = "background_seamless.jpg";

let backgroundX = 0; // Initial position of the background
let scrollSpeed = 7   ; // Speed of background scrolling

let pipetopImg = new Image();
pipetopImg.src = "pipetop.png";
let pipebotImg = new Image();
pipebotImg.src = "pipebot1.png";

// Canvas Context
let c = canvas.getContext("2d");

// Sound and Music
let backgroundMusic = new Audio("stylish-deep-electronic-262632.mp3");
let soundeffect = new Audio("Fart Toot.mp3");
let svgCont = document.getElementById("svgCont");
let soundOn = true;

// Sound Toggle Function
function soundToggle() {
    soundOn = !soundOn;
    svgCont.classList.toggle("sound-on", soundOn);
    svgCont.classList.toggle("sound-off", !soundOn);
    backgroundMusic.volume = soundOn ? 0.01 : 0;
}
svgCont.addEventListener("click", soundToggle);

function pauseAudio(audio) {
    audio.pause();
}

// Play Background Music on Keydown and Click
document.addEventListener("keydown", () => {
    if (soundOn) {
        backgroundMusic.play();
        backgroundMusic.volume = 0.008;
        backgroundMusic.loop = true;
    }
});

document.addEventListener("click", () => {
    if (soundOn) {
        backgroundMusic.play();
        backgroundMusic.volume = 0.08;
        backgroundMusic.loop = true;
    }
});

// Bird Class
class Bird {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocity = 0;
        this.gy = 0.65;
        this.flapPower = -12;
    }

    draw() {
        c.drawImage(birdImg, this.x, this.y, this.width, this.height);
    }

    gravity() {
        this.velocity += this.gy;
        this.y += this.velocity;

        if (this.y + this.height >= canvas.height) {
            GameOver = true;
        }
        if (this.y <= 0) {
            this.y = 1;
        }
    }

    flap() {
        this.velocity = this.flapPower;
        soundeffect.volume = 1;
        soundeffect.playbackRate = 4;
        soundeffect.play();
    }
}

// Pipe Class
class Pipe {
    constructor() {
        this.x = canvas.width;
        this.y = 0;
        this.gap = canvas.height/2.2;
        this.height = Math.random() * (canvas.height - this.gap);
        this.width = 50;
        this.passed = false;
        this.moveSpeed = 3;
        this.increaseMoveSpeedBy = 0.05;
    }

    draw() {
        c.drawImage(pipetopImg, this.x, this.y, this.width, this.height);
        c.drawImage(pipebotImg, this.x, this.y + this.height + this.gap, this.width, canvas.height - (this.y + this.height + this.gap));
    }

    move() {
        this.moveSpeed += this.increaseMoveSpeedBy       
        this.x -= this.moveSpeed;
    }
}

// Collision Detection
function checkCollision(bird, pipe) {
    if (
        bird.x + bird.width > pipe.x &&
        bird.x < pipe.x + pipe.width &&
        (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipe.gap)
    ) {
        GameOver = true;
    }
}

// Scoring
function increaseScore(bird, pipe) {
    if (bird.x > pipe.x + pipe.width && !pipe.passed) {
        score++;
        scoreDiv.innerHTML = `Score: ${score}`;
        pipe.passed = true;
    }
}

// Event Listeners
let bird = new Bird(45, 300, 50, 50);
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && GameOver) {
        restartGame();
    } else if (e.code === "Space") {
        bird.flap();
    }
});
document.addEventListener("touchstart", (e) => {
    if (GameOver) {
        restartGame();
    } else {
        bird.flap();
    }
});

let pipeArr = [];

// Generate a random interval between min and max (in milliseconds)
let t = 0.15
function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate pipes dynamically with random intervals
function addPipeRandomly() {
    const spawnTwoPipes = Math.random() > 0.99; // 1% chance to spawn two pipes

    // Add one or two pipes
    let pipe1 = new Pipe();
    if (score < 10){
        pipe1.increaseMoveSpeedBy = 0.07
    }
    else if (score < 25){
        pipe1.increaseMoveSpeedBy = 0.1
    }
    else if (score >= 25){
        setInterval(()=>{t+=0.01},10000)
        pipe1.increaseMoveSpeedBy = t
    }
    pipeArr.push(pipe1);
    if (spawnTwoPipes) {
        setTimeout(() => {
            let pipe2 = new Pipe()
            if (score < 10){
                pipe2.increaseMoveSpeedBy = 0.07
            }
            else if (score < 25){
                pipe2.increaseMoveSpeedBy = 0.01
            }
            else if (score >=25){
                pipe1.increaseMoveSpeedBy = t
            }
            pipe2.gap = canvas.height/1.5;
            pipe2.height = Math.random() * (canvas.height - (this.gap)*1.5);
            
            pipeArr.push(pipe2);
        }, 380); // Delay second pipe slightly to avoid exact overlap
    }
 
    // Schedule the next pipe spawn
    if(score>27){
        setTimeout(addPipeRandomly, getRandomInterval(410, 800));//short intervals to ensure dynamic gameplay
    }
    else{
        setTimeout(addPipeRandomly, getRandomInterval(750, 900));//long intervals to ensure dynamic gameplay
    }

}

// Start the random pipe spawning
addPipeRandomly();
// Animation Loop
async function animate() {
    let animationID = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    // Move and draw the background
    backgroundX -= scrollSpeed;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0; // Reset background position for looping
    }
    c.drawImage(backgroundImg, backgroundX, 0, canvas.width, canvas.height);
    c.drawImage(backgroundImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);


    bird.draw();
    bird.gravity();

    showHighScore();

    pipeArr.forEach(pipe => {
        pipe.draw();
        pipe.move();
        checkCollision(bird, pipe);
        increaseScore(bird, pipe);
    });

    if (GameOver) {
        cancelAnimationFrame(animationID);
        pauseAudio(backgroundMusic);
        displayGameOver();
        if (score > maxScore) {
            maxScore = score;
            await updateHighScoreOfPlayer(maxScore);
            await checkHighScore()
        }
    }
}

function displayGameOver() {
    let textSize = canvas.width < 600 ? 54 : 84;
    c.font = `bold ${textSize}px sans-serif`;
    c.fillStyle = "black";
    c.fillText("Game Over!", canvas.width / 10, canvas.height / 2);
}

// Restart Game Function
function restartGame() {
    GameOver = false;
    score = 0;
    bird.y = 300;
    bird.velocity = 0;
    pipeArr = [];
    animate();
    scoreDiv.innerHTML = `Score: ${score}`;
    intervalTime = 3000;
}

// Redirect to Index Page
function moveToIndex() {
    window.location.href = "index.html";
}
document.getElementById("homeCont").addEventListener("click", moveToIndex);

// Firebase High Score Update
async function updateHighScoreOfPlayer(maxScore) {
    const playerRef = ref(dataBase, `Players/${playerName}/score`);
    try {
        const snapshot = await get(playerRef);
        if (!snapshot.exists() || maxScore > snapshot.val()) {
            await set(playerRef, maxScore);
            console.log("High score updated in the database.");
        } else {
            console.log("Current score is not higher than stored high score.");
        }
    } catch (error) {
        console.error("Error updating high score:", error);
    }
}
async function checkHighScore() {
    const playerRef = ref(dataBase, `Players`);
    try {
        const snapshot = await get(playerRef);
        const data = snapshot.val();

        // Collect player scores with their names
        let scoresArr = [];
        for (let player in data) {
            scoresArr.push({ name: player, score: data[player]["score"] });
        }

        // Sort scores in descending order and pick the top 3
        scoresArr.sort((a, b) => b.score - a.score);
        const topThreePlayers = scoresArr.slice(0, 3);

        // Prepare top 3 scores data for database
        const topScoresRef = ref(dataBase, `topScores`);
        const topScoresData = {};
        topThreePlayers.forEach((player, index) => {
            topScoresData[`player${index + 1}`] = {
                name: player.name,
                score: player.score
            };
        });

        // Save top 3 players' names and scores to the database
        await set(topScoresRef, topScoresData);

    } catch (e) {
        alert(e);
    }
}

async function showHighScore() {
    const topScoresRef = ref(dataBase, "topScores");

    try {
        const snapshot = await get(topScoresRef);
        const topScoresData = snapshot.val();

        if (topScoresData) {
            // Find the highest score from the top 3 players
            let maxScore = 0;
            for (let key in topScoresData) {
                if (topScoresData[key].score > maxScore) {
                    maxScore = topScoresData[key].score;
                }
            }

            // Display the highest score
            document.getElementById("highScore").innerHTML = `HI: ${maxScore}`;
        } else {
            document.getElementById("highScore").innerHTML = `HI: 0`;
        }
    } catch (e) {
        alert(e);
    }
}

// Start the Game
animate();
