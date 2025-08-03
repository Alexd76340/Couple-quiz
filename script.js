let couples = [];
let scores = {};
let round = 1;
let currentQuestionSet = [];
let currentQuestionIndex = 0;
let currentCoupleIndex = 0;
let currentPhase = 'soft';
let totalRounds = 2;

// ✅ Fonction manquante : randomiser les questions
function getRandomQuestions(questionArray, count) {
  const shuffled = [...questionArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function addCouple() {
  const container = document.getElementById('couples-list');
  const inputGroup = document.createElement('div');
  inputGroup.className = "couple-input";

  const input = document.createElement('input');
  input.type = "text";
  input.placeholder = "Nom du couple";

  inputGroup.appendChild(input);
  container.appendChild(inputGroup);
}

function startGame() {
  const inputs = document.querySelectorAll('#couples-list input');
  couples = [];
  scores = {};
  inputs.forEach(input => {
    if (input.value.trim()) {
      let name = input.value.trim();
      couples.push(name);
      scores[name] = 0;
    }
  });

  if (couples.length < 1) {
    alert("Ajoute au moins un couple !");
    return;
  }

  document.getElementById('setup').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  round = 1;
  currentPhase = 'soft';
  currentQuestionSet = getRandomQuestions(softQuestions, 3);
  currentQuestionIndex = 0;
  currentCoupleIndex = 0;
  document.body.className = 'soft';
  updateDisplay();
}

function updateDisplay() {
  document.getElementById('round-counter').innerText = "Manche " + round;
  document.getElementById('current-question').innerText = currentQuestionSet[currentQuestionIndex];
  document.getElementById('current-couple').innerText = "Couple : " + couples[currentCoupleIndex];
  document.getElementById('question-type').innerText = currentPhase === 'soft' ? "❄️ Question Soft" : "🔥 Question Hot";
}

function validateAnswer(correct) {
  if (correct) {
    const currentCouple = couples[currentCoupleIndex];
    scores[currentCouple]++;
  }

  currentCoupleIndex++;
  if (currentCoupleIndex >= couples.length) {
    currentCoupleIndex = 0;
    currentQuestionIndex++;
    if (currentQuestionIndex >= currentQuestionSet.length) {
      if (currentPhase === 'soft') {
        currentPhase = 'hot';
        currentQuestionSet = getRandomQuestions(hotQuestions, 3);
        currentQuestionIndex = 0;
        document.body.className = 'hot';
      } else {
        round++;
        if (round > totalRounds) {
          endGame();
          return;
        }
        currentPhase = 'soft';
        currentQuestionSet = getRandomQuestions(softQuestions, 3);
        currentQuestionIndex = 0;
        document.body.className = 'soft';
      }
    }
  }
  updateDisplay();
}

function endGame() {
  document.getElementById('game').classList.add('hidden');
  document.getElementById('final').classList.remove('hidden');

  const scoreDiv = document.getElementById('final-scores');
  scoreDiv.innerHTML = "";

  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  const winnerName = winner[0];
  const winnerScore = winner[1];

  const message = document.createElement('h2');
  message.innerText = `🏆 Bravo ${winnerName} ! Vous remportez cette partie avec ${winnerScore} point${winnerScore > 1 ? 's' : ''} !`;
  scoreDiv.insertBefore(message, scoreDiv.firstChild);

  const comment = document.createElement('p');
  if (winnerScore >= 10) {
    comment.innerText = "💖 Vous vous connaissez par cœur !";
  } else if (winnerScore >= 6) {
    comment.innerText = "😊 Encore un peu d'entraînement, mais beau duo !";
  } else {
    comment.innerText = "😅 Va falloir discuter ce soir !";
  }
  scoreDiv.appendChild(comment);

  for (const couple of couples) {
    const score = scores[couple];
    const p = document.createElement('p');
    p.innerText = `${couple} : ${score} pts`;
    scoreDiv.appendChild(p);
  }

  // 🎊 Confettis visuels
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.id = 'confetti-canvas';
  confettiCanvas.style.position = 'fixed';
  confettiCanvas.style.top = '0';
  confettiCanvas.style.left = '0';
  confettiCanvas.style.width = '100%';
  confettiCanvas.style.height = '100%';
  confettiCanvas.style.zIndex = '1000';
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  document.body.appendChild(confettiCanvas);

  const context = confettiCanvas.getContext('2d');
  const confettis = Array.from({ length: 150 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * -window.innerHeight,
    r: Math.random() * 6 + 4,
    d: Math.random() * 5 + 2,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
  }));

  function drawConfetti() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confettis.forEach(p => {
      context.beginPath();
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      context.fillStyle = p.color;
      context.fill();
    });
    moveConfetti();
  }

  function moveConfetti() {
    confettis.forEach(p => {
      p.y += p.d;
      if (p.y > window.innerHeight) {
        p.y = -10;
        p.x = Math.random() * window.innerWidth;
      }
    });
  }

  setInterval(drawConfetti, 30);
}

// ✅ Recharge 100 % fiable du jeu
function restartGame() {
  window.location.href = window.location.href;
}
