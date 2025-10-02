// Quiz Game State
const quizState = {
  currentStage: 0,
  score: 0,
  pizzaLayers: {
    base: false,
    sauce: false,
    mozzarella: false,
    basil: false,
    complete: false
  }
};

// Quiz Questions and Answers
const quizStages = [
  {
    id: 1,
    icon: '🍕',
    title: 'Stage 1: Choose Your Pizza Type',
    question: 'What type of pizza are we making?',
    hint: 'This style originated from Rome and features a thin, crispy crust',
    options: [
      { text: 'Neapolitan Pizza', value: 'neapolitan', image: '/images/neopolitan.jpg' },
      { text: 'Roman-Style Pizza', value: 'roman', image: '/images/roman.jpg' },
      { text: 'Deep Dish Pizza', value: 'deepdish', image: '/images/deepdish.jpg' },
      { text: 'Sicilian Pizza', value: 'sicilian', image: '/images/sicilian.jpg' }
    ],
    correctAnswer: 'roman',
    feedback: {
      correct: '✅ Excellent! Roman-style pizza (Pizza Romana) has a thin, crispy crust that\'s crunchier than Neapolitan pizza.',
      incorrect: '❌ Not quite! We\'re looking for Roman-style pizza, which has a thinner, crispier crust than other styles.'
    },
    layer: 'base'
  },
  {
    id: 2,
    icon: '🍅',
    title: 'Stage 2: Select Your Sauce',
    question: 'What sauce should go on a classic Margherita pizza?',
    hint: 'Keep it simple and authentic - this is the foundation of flavor',
    options: [
      { text: 'Tomato Sauce', value: 'tomato', image: '/images/tomato.jpg' },
      { text: 'White Cream Sauce', value: 'white', image: '/images/whitecream.jpg' },
      { text: 'Pesto Sauce', value: 'pesto', image: '/images/pesto.jpg' },
      { text: 'BBQ Sauce', value: 'bbq', image: '/images/bbq.jpg' }
    ],
    correctAnswer: 'tomato',
    feedback: {
      correct: '✅ Perfect! Fresh tomato sauce is the authentic base for a Margherita pizza.',
      incorrect: '❌ Not the right choice! A classic Margherita uses simple tomato sauce.'
    },
    layer: 'sauce'
  },
  {
    id: 3,
    icon: '🧀',
    title: 'Stage 3: Add Your First Topping',
    question: 'What cheese topping defines a Margherita pizza?',
    hint: 'This cheese is essential for the "white" in the Italian flag colors',
    options: [
      { text: 'Mozzarella', value: 'mozzarella', image: '/images/mozzarella.jpg' },
      { text: 'Parmesan', value: 'parmesan', image: '/images/parmesan.jpg' },
      { text: 'Cheddar', value: 'cheddar', image: '/images/cheddar.jpg' },
      { text: 'Gorgonzola', value: 'gorgonzola', image: '/images/gorgonzola.jpg' }
    ],
    correctAnswer: 'mozzarella',
    feedback: {
      correct: '✅ Bravo! Fresh mozzarella is the star cheese of a Margherita pizza.',
      incorrect: '❌ Try again! Mozzarella is the traditional cheese for Margherita pizza.'
    },
    layer: 'mozzarella'
  },
  {
    id: 4,
    icon: '🌿',
    title: 'Stage 4: Add Your Second Topping',
    question: 'What herb completes the Italian flag colors on a Margherita?',
    hint: 'This aromatic herb represents the "green" in the Italian flag',
    options: [
      { text: 'Basil', value: 'basil', image: '/images/basil.jpg' },
      { text: 'Oregano', value: 'oregano', image: '/images/oregano.jpg' },
      { text: 'Parsley', value: 'parsley', image: '/images/parsley.jpg' },
      { text: 'Arugula', value: 'arugula', image: '/images/arugula.jpg' }
    ],
    correctAnswer: 'basil',
    feedback: {
      correct: '✅ Magnifico! Fresh basil leaves are the signature herb of Margherita pizza.',
      incorrect: '❌ Not quite! Fresh basil is the traditional herb that completes a Margherita.'
    },
    layer: 'basil'
  },
  {
    id: 5,
    icon: '✨',
    title: 'Stage 5: Final Topping',
    question: 'What additional toppings should you add to a traditional Margherita?',
    hint: 'Sometimes perfection means knowing when to stop!',
    options: [
      { text: 'None - It\'s Perfect!', value: 'none', image: '/images/none.jpg' },
      { text: 'Pepperoni', value: 'pepperoni', image: '/images/pepperoni.jpg' },
      { text: 'Mushrooms', value: 'mushrooms', image: '/images/mushroom.jpg' },
      { text: 'Olives', value: 'olives', image: '/images/olives.jpg' }
    ],
    correctAnswer: 'none',
    feedback: {
      correct: '✅ Perfetto! A true Margherita pizza is about simplicity - just sauce, mozzarella, and basil!',
      incorrect: '❌ Less is more! An authentic Margherita doesn\'t need any more toppings.'
    },
    layer: 'complete'
  }
];

// DOM Elements
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const pizzaBase = document.getElementById('pizza-base');
const pizzaSauce = document.getElementById('pizza-sauce');
const pizzaToppings = document.getElementById('pizza-toppings');
const stageIndicator = document.getElementById('stage-indicator');
const stageTitle = document.getElementById('stage-title');
const questionText = document.getElementById('question-text');
const questionHint = document.getElementById('question-hint');
const answerOptions = document.getElementById('answer-options');
const feedbackArea = document.getElementById('feedback-area');
const feedbackContent = document.getElementById('feedback-content');
const nextButton = document.getElementById('next-button');
const successScreen = document.getElementById('success-screen');
const playAgainButton = document.getElementById('play-again-button');
const questionCard = document.getElementById('question-card');
const quizContent = document.getElementById('quiz-content');

// Initialize Quiz
function initQuiz() {
  quizState.currentStage = 0;
  quizState.score = 0;
  quizState.pizzaLayers = {
    base: false,
    sauce: false,
    mozzarella: false,
    basil: false,
    complete: false
  };
  
  // Reset pizza visual
  pizzaBase.className = 'pizza-base';
  pizzaSauce.className = 'pizza-sauce';
  pizzaToppings.innerHTML = '';
  
  // Reset pizza builder
  const pizzaBuilder = document.querySelector('.pizza-builder');
  pizzaBuilder.classList.remove('transforming');
  
  // Show quiz content, hide success screen
  quizContent.classList.remove('hidden');
  successScreen.classList.remove('show');
  successScreen.style.display = 'none';
  
  // Show question card
  questionCard.style.display = 'block';
  questionCard.style.opacity = '1';
  feedbackArea.style.display = 'none';
  
  // Load first stage
  loadStage(0);
}

// Load a specific stage
function loadStage(stageIndex) {
  const stage = quizStages[stageIndex];
  
  // Update progress
  const progress = ((stageIndex) / quizStages.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `Stage ${stageIndex + 1} of ${quizStages.length}`;
  
  // Update stage indicator
  stageIndicator.querySelector('.stage-icon').textContent = stage.icon;
  stageTitle.textContent = stage.title;
  
  // Update question
  questionText.textContent = stage.question;
  questionHint.textContent = stage.hint;
  
  // Render answer options
  renderAnswerOptions(stage);
  
  // Reset feedback area
  feedbackArea.style.display = 'none';
  questionCard.style.display = 'block';
}

// Render answer options
function renderAnswerOptions(stage) {
  answerOptions.innerHTML = '';
  
  stage.options.forEach(option => {
    const optionCard = document.createElement('div');
    optionCard.className = 'answer-option';
    optionCard.innerHTML = `
      <div class="option-image" style="background-image: url('${option.image}')"></div>
      <div class="option-text">${option.text}</div>
    `;
    
    optionCard.addEventListener('click', () => handleAnswer(option.value, stage));
    answerOptions.appendChild(optionCard);
  });
}

// Handle answer selection
function handleAnswer(selectedValue, stage) {
  const isCorrect = selectedValue === stage.correctAnswer;
  
  // Disable all options
  const options = answerOptions.querySelectorAll('.answer-option');
  options.forEach(option => {
    option.style.pointerEvents = 'none';
    option.style.opacity = '0.6';
  });
  
  // Highlight selected option
  const selectedOption = Array.from(options).find(opt => 
    opt.textContent.trim().includes(stage.options.find(o => o.value === selectedValue).text)
  );
  
  if (selectedOption) {
    selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');
    selectedOption.style.opacity = '1';
  }
  
  // Show feedback
  setTimeout(() => {
    if (isCorrect) {
      quizState.score++;
      updatePizzaVisual(stage.layer);
    }
    
    showFeedback(isCorrect, stage);
  }, 500);
}

// Update pizza visual
function updatePizzaVisual(layer) {
  switch(layer) {
    case 'base':
      pizzaBase.classList.add('show');
      quizState.pizzaLayers.base = true;
      break;
    case 'sauce':
      pizzaSauce.classList.add('show');
      quizState.pizzaLayers.sauce = true;
      break;
    case 'mozzarella':
      // Add multiple spotty mozzarella pieces
      for (let i = 0; i < 5; i++) {
        const mozzarella = document.createElement('div');
        mozzarella.className = 'topping topping-mozzarella';
        pizzaToppings.appendChild(mozzarella);
        setTimeout(() => mozzarella.classList.add('show'), 50 + (i * 100));
      }
      quizState.pizzaLayers.mozzarella = true;
      break;
    case 'basil':
      // Add multiple basil leaves
      for (let i = 0; i < 5; i++) {
        const basil = document.createElement('div');
        basil.className = 'topping topping-basil';
        basil.style.top = `${20 + Math.random() * 60}%`;
        basil.style.left = `${20 + Math.random() * 60}%`;
        basil.style.transform = `rotate(${Math.random() * 360}deg)`;
        pizzaToppings.appendChild(basil);
        setTimeout(() => basil.classList.add('show'), 50 + (i * 100));
      }
      quizState.pizzaLayers.basil = true;
      break;
    case 'complete':
      quizState.pizzaLayers.complete = true;
      break;
  }
}

// Show feedback
// Show feedback
function showFeedback(isCorrect, stage) {
  const feedback = isCorrect ? stage.feedback.correct : stage.feedback.incorrect;
  
  feedbackContent.innerHTML = `
    <div class="feedback-message ${isCorrect ? 'feedback-success' : 'feedback-error'}">
      ${feedback}
    </div>
  `;
  
  // Update button text and behavior based on correctness
  if (isCorrect) {
    nextButton.textContent = 'Next Stage →';
    nextButton.onclick = () => {
      quizState.currentStage++;
      
      if (quizState.currentStage < quizStages.length) {
        loadStage(quizState.currentStage);
      } else {
        showSuccessScreen();
      }
    };
  } else {
    nextButton.textContent = '🔄 Try Again';
    nextButton.onclick = () => {
      // Reload the same stage
      loadStage(quizState.currentStage);
    };
  }
  
  questionCard.style.display = 'none';
  feedbackArea.style.display = 'flex';
}

// Handle next button (moved to showFeedback function for conditional logic)
// nextButton.addEventListener('click', () => {
//   quizState.currentStage++;
//   
//   if (quizState.currentStage < quizStages.length) {
//     loadStage(quizState.currentStage);
//   } else {
//     showSuccessScreen();
//   }
// });

// Show success screen
async function showSuccessScreen() {
  // Update progress to 100%
  progressFill.style.width = '100%';
  progressText.textContent = 'Complete! 🎉';
  
  // Hide quiz content with fade out
  quizContent.style.opacity = '0';
  
  setTimeout(() => {
    // Hide quiz content completely
    quizContent.classList.add('hidden');
    
    // Load and show success screen
    loadFinalPizzaImage();
    
    setTimeout(() => {
      successScreen.style.display = 'grid';
      setTimeout(() => {
        successScreen.classList.add('show');
      }, 50);
    }, 100);
  }, 300);
}

// Load final pizza image from Unsplash or similar API
async function loadFinalPizzaImage() {
  const finalPizzaImage = document.getElementById('final-pizza-image');
  
  try {
    // Using local Roman-style Margherita pizza image
    const imageUrl = '/images/roman.jpg';
    
    finalPizzaImage.src = imageUrl;
    finalPizzaImage.alt = 'Authentic Roman-Style Margherita Pizza';
  } catch (error) {
    console.error('Error loading pizza image:', error);
    // Fallback to same image
    finalPizzaImage.src = '/images/roman.jpg';
  }
}

// Play again button
playAgainButton.addEventListener('click', () => {
  initQuiz();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
});
