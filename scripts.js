const game = document.getElementById('game');
const score = document.getElementById('score');
const film = 11;
const levels = ['easy', 'medium', 'hard']

function addGenre(){
    const column = document.createElement('div');
    column.classList.add('genre-column');
    column.innerHTML = "This is a genre."
    game.append(column);
}

addGenre();