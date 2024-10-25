let level = 0;
let currentNumber = "";
let startTime;
let results = [];

// HTML-elementen
const startBtn = document.getElementById("startBtn");
const instruction = document.getElementById("instruction");
const game = document.getElementById("game");
const numberDisplay = document.getElementById("numberDisplay");
const userInput = document.getElementById("userInput");
const submitBtn = document.getElementById("submitBtn");
const levelDisplay = document.getElementById("level");

// Functie om een willekeurig getal te genereren
function generateRandomNumber(length) {
    let number = "";
    for (let i = 0; i < length; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

// Start nieuw level
function startLevel() {
    level++;
    currentNumber = generateRandomNumber(level);
    levelDisplay.textContent = level;
    showNumber(currentNumber);
}

// Toon het gegenereerde getal en verberg het daarna
function showNumber(number) {
    numberDisplay.textContent = number;
    game.style.display = "none";
    setTimeout(() => {
        numberDisplay.textContent = "";
        game.style.display = "block";
        userInput.value = "";
        userInput.focus();
        startTime = new Date();
    }, 1500 + level * 500);  // Getal is langer zichtbaar naarmate het level toeneemt
}

// Controleer de ingevoerde input
function checkInput() {
    const userAnswer = userInput.value;
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;

    if (userAnswer === currentNumber) {
        instruction.textContent = "Goed gedaan! Volgende level.";
        results.push({ level: level, time: timeTaken });
        sendResults({ level: level, time: timeTaken });  // Resultaten verzenden naar server
        startLevel();
    } else {
        instruction.textContent = "Fout! Probeer opnieuw.";
        resetGame();
    }
}

// Reset het spel bij foutieve input
function resetGame() {
    level = 0;
    currentNumber = "";
    game.style.display = "none";
    startBtn.style.display = "block";
    instruction.textContent = "Klik op Start om opnieuw te beginnen.";
}

// Resultaten verzenden naar een server
function sendResults(data) {
    fetch("https://example-server.com/api/saveResults", {  // Vervang door echte server-URL
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Resultaten succesvol opgeslagen:", data);
    })
    .catch((error) => {
        console.error("Fout bij het opslaan van de resultaten:", error);
    });
}

// Event listeners voor start- en submitknoppen
startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    instruction.textContent = "Onthoud het getal en voer het in!";
    startLevel();
});

submitBtn.addEventListener("click", checkInput);
userInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        checkInput();
    }
});
