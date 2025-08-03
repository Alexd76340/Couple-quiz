let couples = [];
let scores = {};
let round = 1;
let currentQuestionSet = [];
let currentQuestionIndex = 0;
let currentCoupleIndex = 0;
let currentPhase = 'soft';
let totalRounds = 2;

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

function getRandomQuestions(questionArray, count) {
  const shuffled = questionArray.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
  for (const couple of couples) {
    const score = scores[couple];
    const p = document.createElement('p');
    p.innerText = `${couple} : ${score} pts`;
    scoreDiv.appendChild(p);
  }
}

function restartGame() {
  location.reload();
}
