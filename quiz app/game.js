const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText'); 
const scoreText = document.getElementById('score'); 
const progressBarFull = document.getElementById('progressBarFull'); 

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=3&category=12&type=multiple")
.then( res =>{
    return res.json();
})
.then(loadedQuestions => {
    questions = loadedQuestions.results.map(loadedQuestions => {
        const formattedQuestion = {
            question: loadedQuestions.question
        };

        const answerChoices = [...loadedQuestions.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
        answerChoices.splice(formattedQuestion.answer -1, 0 , loadedQuestions.correct_answer);
        
        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice"+(index + 1)] = choice;
        });
        
        return formattedQuestion;
    })
    //questions = loadedQuestions;
    startGame();
}).catch( error => {
    console.log(err);
})

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    //create a copy of all the questions 
    availableQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign("/end.html");
    }

    questionCounter++;
    progressText.innerText = `Questions ${questionCounter} / ${MAX_QUESTIONS}`;
    // Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach (choice =>{
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });
    //remove the question we use
    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;

};


choices.forEach( choice =>{
    choice.addEventListener('click', e => {

        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        var classToApply = 'incorrect';
        if(selectedAnswer == currentQuestion.answer){
            classToApply = 'correct';
        }

        if(classToApply === 'correct'){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply); 

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);
            
    })
})

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

