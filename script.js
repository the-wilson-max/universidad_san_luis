const questions = [
  {
    question: "¿Qué se entiende por potencial humano?",
    options: [
      "Los recursos naturales de un país.",
      "Las capacidades, conocimientos, habilidades y talentos de las personas.",
      "La cantidad de empresas de un país.",
      "El territorio nacional."
    ],
    correct: 1
  },
  {
    question: "¿Cuál de los siguientes factores contribuye al desarrollo del potencial humano?",
    options: [
      "La educación de calidad.",
      "La falta de empleo.",
      "La desigualdad social.",
      "La falta de servicios básicos."
    ],
    correct: 0
  },
  {
    question: "¿Qué estudian las características sociodemográficas de una población?",
    options: [
      "Solamente sus recursos naturales.",
      "Aspectos como edad, sexo, población, distribución y condiciones de vida.",
      "Únicamente la economía de un país.",
      "Solamente sus actividades agrícolas."
    ],
    correct: 1
  },
  {
    question: "¿Cuál es la relación entre el potencial humano y el desarrollo del Perú?",
    options: [
      "El desarrollo depende únicamente de los recursos naturales.",
      "El potencial humano permite aprovechar conocimientos y capacidades para impulsar el desarrollo del país.",
      "No existe ninguna relación.",
      "El potencial humano solo sirve para el ámbito educativo."
    ],
    correct: 1
  },
  {
    question: "¿Por qué es importante la educación para el potencial humano?",
    options: [
      "Porque permite desarrollar conocimientos y habilidades.",
      "Porque elimina la diversidad cultural.",
      "Porque reduce la población.",
      "Porque reemplaza el trabajo."
    ],
    correct: 0
  },
  {
    question: "¿Cuál es una característica sociodemográfica del Perú?",
    options: [
      "La distribución de la población en las diferentes regiones.",
      "La cantidad de minerales existentes.",
      "La cantidad de montañas.",
      "La extensión de los océanos."
    ],
    correct: 0
  },
  {
    question: "¿Qué problema puede limitar el desarrollo del potencial humano en las zonas rurales del Perú?",
    options: [
      "El acceso limitado a educación y servicios básicos.",
      "La existencia de diferentes culturas.",
      "La diversidad de paisajes.",
      "La variedad de alimentos."
    ],
    correct: 0
  },
  {
    question: "¿Cómo influye la población joven en el potencial humano del Perú?",
    options: [
      "Representa una oportunidad para el desarrollo si recibe educación y empleo adecuado.",
      "Impide el crecimiento económico.",
      "Reduce las oportunidades de desarrollo.",
      "No tiene ninguna relación con el desarrollo."
    ],
    correct: 0
  },
  {
    question: "¿Cuál sería una forma de fortalecer el potencial humano del Perú?",
    options: [
      "Mejorar la educación, la salud y las oportunidades laborales.",
      "Reducir el acceso a la educación.",
      "Disminuir las oportunidades de empleo.",
      "Limitar el acceso a los servicios básicos."
    ],
    correct: 0
  },
  {
    question: "¿Cuál de las siguientes situaciones puede ocasionar problemas en el desarrollo del potencial humano del Perú?",
    options: [
      "Malas decisiones y políticas insuficientes del Estado.",
      "Falta de interés o abandono de la educación.",
      "Desigualdad en el acceso a oportunidades y servicios básicos.",
      "Todas las anteriores."
    ],
    correct: 3
  }
];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers");
const feedback = document.getElementById("feedback");

const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");

const soundGood = document.getElementById("sound-good");
const soundBad = document.getElementById("sound-bad");
const confettiCanvas = document.getElementById("confetti-canvas");

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function showScreen(screen) {
  startScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  screen.classList.add("active");
}

function renderQuestion() {
  const q = questions[currentQuestionIndex];
  answered = false;
  feedback.className = "feedback";
  feedback.textContent = "";

  progressText.textContent = `Pregunta ${currentQuestionIndex + 1} / ${questions.length}`;
  progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
  questionText.textContent = q.question;

  answersContainer.innerHTML = "";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";
    button.textContent = option;
    button.dataset.index = index;

    button.addEventListener("click", () => handleAnswer(button, index));
    answersContainer.appendChild(button);
  });
}

function playSound(type) {
  const audio = type === "good" ? soundGood : soundBad;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function launchConfetti() {
  const ctx = confettiCanvas.getContext("2d");
  const pieces = [];
  const colors = ["#f4c95d", "#2ecc71", "#0d2d4d", "#e74c3c", "#1a456d", "#f9e7a1"];

  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  for (let i = 0; i < 140; i++) {
    pieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      r: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 2 + Math.random() * 4,
      speedX: (Math.random() - 0.5) * 5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25
    });
  }

  let animationFrame;

  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    pieces.forEach(piece => {
      piece.x += piece.speedX;
      piece.y += piece.speedY;
      piece.rotation += piece.rotationSpeed;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.r / 2, -piece.r / 2, piece.r, piece.r * 1.5);
      ctx.restore();
    });

    const active = pieces.some(piece => piece.y < confettiCanvas.height);
    if (active) {
      animationFrame = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  draw();
}

function handleAnswer(selectedButton, selectedIndex) {
  if (answered) return;
  answered = true;

  const q = questions[currentQuestionIndex];
  const correctIndex = q.correct;
  const buttons = Array.from(document.querySelectorAll(".answer-btn"));

  buttons.forEach(btn => {
    btn.disabled = true;
    const idx = Number(btn.dataset.index);

    if (idx === correctIndex) {
      btn.classList.add("correct");
    }

    if (idx === selectedIndex && selectedIndex !== correctIndex) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedIndex === correctIndex) {
    score++;
    selectedButton.classList.add("correct");
    feedback.textContent = "¡Respuesta correcta!";
    feedback.className = "feedback visible success";
    playSound("good");
    launchConfetti();

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        renderQuestion();
      } else {
        showFinalResult();
      }
    }, 1800);

  } else {
    selectedButton.classList.add("incorrect");
    feedback.textContent = "Respuesta incorrecta. Inténtalo de nuevo.";
    feedback.className = "feedback visible error";
    playSound("bad");

    setTimeout(() => {
      feedback.className = "feedback";
      feedback.textContent = "";
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("selected", "correct", "incorrect");
      });
      answered = false;
    }, 1200);
  }
}

function showFinalResult() {
  showScreen(resultScreen);
  finalScore.textContent = `${score} / ${questions.length}`;

  if (score === 10) {
    resultMessage.textContent = "¡Perfecto! Excelente. Dominas completamente el tema de potencial humano y características sociodemográficas del Perú.";
  } else if (score >= 8) {
    resultMessage.textContent = "¡Muy bien! Tienes un dominio excelente del tema. Solo refuerza algunos conceptos.";
  } else if (score >= 6) {
    resultMessage.textContent = "Buen trabajo. Has demostrado buen conocimiento, pero aún puedes mejorar ciertos aspectos.";
  } else if (score >= 4) {
    resultMessage.textContent = "Buen intento. Revisa nuevamente el contenido y vuelve a intentarlo para mejorar.";
  } else {
    resultMessage.textContent = "Puedes mejorar. Te recomiendo estudiar nuevamente el tema y volver a responder.";
  }
}

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  showScreen(quizScreen);
  renderQuestion();
}

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);