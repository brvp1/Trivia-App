// Setting a variable for game (section -> id='game')
const game = document.getElementById('game');
// Setting a variable for score (span -> id='score')
const scoreDisplay = document.getElementById('score');
let score = 0;

// FETCH DATA FROM API
    // The URL includes queries such as category (number), levels (easy, med, hard) which we will add to our game
    // Create an array of objects representing each genre name and it's associated value in the API URL 
const genres = [
    {
        name: 'Film',
        id: 11 
    },
    {
        name: 'Books',
        id: 10
    },
    {
        name: 'Music',
        id: 12
    },
    {
        name: 'Video Games',
        id: 15
    }
]
const levels = ['easy', 'medium', 'hard'];

// Create a function to fetch API data for a specific genre, getGenre() which is the 'column' in the game
function addGenre(genre) {
    // CREATE A COLUMN, STYLE IT, APPEND IT TO THE EXISTING 'GAME' DIV IN HTML


    // We create a column (of 3 cards) for each genre (4 genres in total for this game). We will create each column in JS
    const column = document.createElement('div');  // Creates a new div

    // Add a class to the newly created element (div), 'column'
    column.classList.add('genre-column');
    // Next, go straight to CSS to style the 'genre-column'
    column.innerHTML = genre.name;
    // The 'column' div that we created is nowhere but in our Javascript file. In order to show it, we are going to use the .append method to add the 'column' the existing 'game' div in our HTML file.
    game.append(column)


    // FETCH THE QUESTIONS FROM THE API BASED ON THE DIFFERENT LEVELS

    levels.forEach(level => {
        // [STEP 2] : Create a 'card' div in JS which will be the card for each question
        const card = document.createElement('div');
        // Give the new div 'card' a class of 'card using JS. Then, go to CSS to style it
        card.classList.add('card');
        // Just like we appended, the 'column' to the 'game' div; we will now append the 'card' to the 'column'. HOWEVER,this will happen 3 times because we are looping with forEach()
        column.append(card);

        // [STEP 4] : Add scores based on the level of each question
        if (level === 'easy') {
            card.innerHTML = 100;
        }
        if (level === 'medium') {
            card.innerHTML = 200;
        }
        if (level === 'hard') {
            card.innerHTML = 300; 
        }

        // [STEP 1] : Get or fetch 3 questions for each level (easy, medium, hard) from the API using the forEach() array method. Loop over the 'levels' array with forEach, then get the JSON response, then console.log the data that comes back
        fetch(`https://opentdb.com/api.php?amount=1&category=${genre.id}&difficulty=${level}&type=boolean`)  // ${level} replaces the level (e,m,h) on each iteration
        .then(response => response.json())
        .then(data => {
            // *There is not enough data to get 10 items per difficulty level and get random
            // question using Math.random() and passing it through instead of 0
            // ex: if amount=10 above, you could do:
            // const randomNumber = Math.floor(Math.random() * 10)
            // and pass through the randomNumber, s0:
            // data.results[randomNumber].question
            console.log(data);
        // [ STEP 3] : Add data or attributes to the card (like questions, values (T or F))
            // Here, we are taking the card and adding a question using setAttribute which takes 2 values - attribue name and value. We can give any name (data-question in the first case, and the value is the JSON response)
            card.setAttribute('data-question', data.results[0].question); // question
            card.setAttribute('data-answer', data.results[0].correct_answer) // correct answer
            // [STEP 4 ctd]: SetAttribute 'data-value' - here we are assigning the scores for each card based on the diffiulty (refer if statements above).
            // The name is 'data-value' and the value is obtained through a JS method called 'getInnerHTML' (which will get the scores from the if statement above)
            card.setAttribute('data-value', card.getInnerHTML());
        })
        .then(done => card.addEventListener('click', flipCard) )
        // [STEP 5] : Add an event listener in the forEach() for each card and then call the function 'flipCard' in order to display the questions when we click the card
        card.addEventListener('click', flipCard);
    })
}

// Call the addGenre() function to see the (genre) columns
// addGenre(genres[0]);
// HOWEVER, we are going to loop over the 4 generes (array of objects we created above) in order to create the 4 columns and call the function
genres.forEach(genre => addGenre(genre));


// DISPLAY QUESTION WHEN WE CLICK ANY OF THE CARDS
function flipCard() {
    // this.innerHTML = 
    this.style.fontSize = '15px';
    // Create an element ('div') to display the question and 2 buttons to let the user click "True" or "False"
    const textDisplay = document.createElement('div');
    const trueButton = document.createElement('button');
    const falseButton = document.createElement('button');
    // Add text to the buttons. Make sure that the innerHTML value EXACTLY matches the 'data-answer' attribute we set earlier
    trueButton.innerHTML = 'True';
    falseButton.innerHTML = 'False';
    trueButton.classList.add('true-button');
    falseButton.classList.add('false-button')
    // Add event listener when we click the 'true' or 'false' button so that the correct answer is displayed (from function getResult())
    trueButton.addEventListener('click', getResult);
    falseButton.addEventListener('click', getResult);
    textDisplay.innerHTML = this.getAttribute('data-question'); // gets the particular question for each card 
    //  Display the question and button options above when the card is clicked
    this.append(textDisplay, trueButton, falseButton)

    // [1] Find all the elements of the class of '.card' and create a new array from the available cards and [2] disable the click event for each card in the new array
    const allCards = Array.from(document.querySelectorAll('.card')); 
    allCards.forEach(card => card.removeEventListener('click', flipCard));
}

// We create a function for when we click on the button ('True' or 'False'), and we want to find out what the correct answer is
function getResult() {
    // Make other cards clickable once we see the correct answer or click so add the event listener back again
    const allCards = Array.from(document.querySelectorAll('.card'));
    allCards.forEach(card => card.addEventListener('click', flipCard));

    // Get the parent of the button which is the card
    const cardOfButton = this.parentElement;
    // If the answer is correct, [1] we add to the score, [2] we update the score on display, [3] we remove all the elements to we cannot cheat and add to the score
    if (cardOfButton.getAttribute('data-answer') === this.innerHTML) {
        // Add score, if answer is correct
        score += Number(cardOfButton.getAttribute('data-value')); 
        scoreDisplay.innerHTML = score;
        cardOfButton.classList.add('correct-answer');
        // Remove the children 
        setTimeout(() => {
            while (cardOfButton.firstChild) {
                cardOfButton.removeChild(cardOfButton.lastChild);
            }
            // Display the correct answer
            cardOfButton.innerHTML = cardOfButton.getAttribute('data-value');
    }, 100)
    } else { // If the answer is incorrect 
        cardOfButton.classList.add('wrong-answer')
        setTimeout(() => {
            while (cardOfButton.firstChild) {
                cardOfButton.removeChild(cardOfButton.lastChild);
            }
            cardOfButton.innerHTML = 0
        }, 100)
    }
    // Remove event listener so we cannot interact with any other card till we answer the current card
    cardOfButton.removeEventListener('click', flipCard);
}