import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Wait until DOM is loaded


// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5Q80mGifPD8PDNRUi1nHqX1CpAN39ujs",
    authDomain: "farty-81f96.firebaseapp.com",
    databaseURL: "https://project-44037-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "farty-81f96",
    storageBucket: "farty-81f96.firebasestorage.app",
    messagingSenderId: "418284906503",
    appId: "1:418284906503:web:f64a389de75ed7764b22a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);
async function storeName(Name) {
    const maxScore = 0;
    try {
      const playerRef = ref(dataBase, "Players/" + Name + "/score");
      const snapshot = await get(playerRef);

      if (snapshot.exists()) {
        console.log("Player already exists with score:", snapshot.val());
      } else {
        await set(playerRef, maxScore);
        console.log("New player added with score:", maxScore);
      }
    } catch (e) {
      alert(e);
    }
}

function goto(){
      console.log("Navigating to game.html");
      window.location.href = "game.html";
}
async function showTopThreePlayers() {
    const topScoresRef = ref(dataBase, "topScores");

    try {
        const snapshot = await get(topScoresRef);
        const topScoresData = snapshot.val();

        if (topScoresData) {
            // Iterate over the top 3 players in `topScoresData` and display their names and scores
            for (let i = 1; i <= 3; i++) {
                if (topScoresData[`player${i}`]) {
                    const playerName = topScoresData[`player${i}`].name;
                    const playerScore = topScoresData[`player${i}`].score;

                    document.getElementById(`highestScore${i}`).innerHTML = 
                        `TOP ${i}: ${playerName} with a score of ${playerScore}`;
                } else {
                    // If there are less than 3 players, fill the remaining slots as empty
                    document.getElementById(`highestScore${i}`).innerHTML = 
                        `Outstanding Player ${i}: No player data available`;
                }
            }
        } else {
            // Handle case if `topScoresData` is empty or null
            for (let i = 1; i <= 3; i++) {
                document.getElementById(`highestScore${i}`).innerHTML = 
                    `Outstanding Player ${i}: No player data available`;
            }
        }
    } catch (e) {
        alert(e);
    }
}


async function startGame() {
      const playerNameInput = document.getElementById("playerName");
      let playerName = playerNameInput.value;

      if (playerName) {
          await storeName(playerName); // Wait for storeName to finish
          localStorage.setItem("playername",playerName)
          goto(); // Only navigate after storeName is done
      } else {
          alert("Please enter your name.");
      }
}
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("button");
    btn.addEventListener("click", startGame);
    showTopThreePlayers()
});