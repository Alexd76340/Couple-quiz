let couples = [];
let scores = {};
let round = 1;
let currentQuestionSet = [];
let currentQuestionIndex = 0;
let currentCoupleIndex = 0;
let currentPhase = 'soft';
let totalRounds = 2;

// ✅ Questions à utiliser dans le jeu
const softQuestions = [
  "Quelle est ta couleur préférée ?",
  "Quel est ton plat préféré ?",
  "Quel est ton animal préféré ?",
  "Quelle est ta saison préférée ?",
  "Quel est ton film favori ?",
  "Quel pays rêves-tu de visiter ?",
  "Quel est ton acteur préféré ?",
  "Quelle est ton actrice préférée ?",
  "Quelle est ta série préférée ?",
  "Quelle est ta plus grande qualitée ?",
  "Quel est ton plus gros défaut ?",
  "Quel est ton deuxième prénom ?",
  "Quel surnom ton partenaire te donne t'il ?",
  "Quelle partie de ton corps tu aime le plus ?",
  "Quelle partie du corps tu aime le moins ?",
  "Quelle est ton plus grand rêve ?",
  "Ton jeu vidéo préféré ?",
  "Ton sport préféré ?",
  "Ton souvenir préféré avec ton copain/copine ?",
  "Le plus beau cadeau qu'il ou qu'elle t'a fait ?",
  "Comment imagines-tu ta vie dans 5 ans ?",
  "Quel est le moment de ta relation que tu aimerais revivre ?",
  "Ta chanson préférée ?",
  "La première chose que tu as regardée chez lui/elle ?"
];

const hotQuestions = [
  "Quel est ton plus grand fantasme ?",
  "Quelle est ta zone érogène préférée ?",
  "Quelle est ta position favorite ?",
  "Quel est ton endroit préféré pour faire l'amour ?",
  "Avec quel acteur/actrice tu voudrais coucher ?",
  "L'endroit le plus insolite où tu as fait l'amour ?",
  "Ta plus grosse honte au lit ?",
  "La chose la plus hard que tu as faite ?",
  "L'anecdote la plus drôle en faisant l'amour ?",
  "La partie du corps que tu préfères chez l'autre ?",
  "Ta position sexuelle préférée ?",
  "L'endroit le plus insolite où tu as fait l'amour ?",
  "Si ton partenaire te chuchote à l'oreille maintenant, tu voudrais entendre quoi ?",
  "Qu'est-ce que tu aimerais que ton partenaire fasse le plus au lit ?",
  "Comment tu cherches ton partenaire quand tu as envie ?",
  "Quelle a été la première pensée coquine quand tu as vu ton partenaire ?"
];

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
  
  // Vérification des couples ajoutés
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

  console.log(couples); // Vérifie les couples ajoutés
  
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
  // Mise à jour de l'affichage des informations
  console.log("Question courante: ", currentQuestionSet[currentQuestionIndex]); // Vérifie la question actuelle
  console.log("Couple courant: ", couples[currentCoupleIndex]); // Vérifie le couple actuel

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
    color: `hsl(${Math.random() * 360}, 70%, 60%)`
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

// ✅ Fonction pour redémarrer le jeu
function restartGame() {
  // Réinitialiser toutes les variables
  couples = [];
  scores = {};
  round = 1;
  currentQuestionSet = [];
  currentQuestionIndex = 0;
  currentCoupleIndex = 0;
  currentPhase = 'soft';

  // Réinitialiser l'affichage des éléments du jeu
  document.getElementById('final').classList.add('hidden');
  document.getElementById('setup').classList.remove('hidden');
  document.getElementById('game').classList.add('hidden');
  
  // Réinitialiser les champs des couples si nécessaire
  const inputs = document.querySelectorAll('#couples-list input');
  inputs.forEach(input => {
    input.value = '';  // Effacer les valeurs des champs
  });

  // Réinitialiser l'interface utilisateur, comme les scores et le compteur de manches
  document.getElementById('round-counter').innerText = "Manche " + round;
  document.getElementById('current-question').innerText = "";
  document.getElementById('current-couple').innerText = "";
  document.getElementById('question-type').innerText = "";

  // Optionnel : Réinitialiser les éventuels effets visuels comme les confettis
  const confettiCanvas = document.getElementById('confetti-canvas');
  if (confettiCanvas) {
    confettiCanvas.remove();
  }

  // Réinitialiser la classe du corps (soft ou hot)
  document.body.className = 'soft';
}
