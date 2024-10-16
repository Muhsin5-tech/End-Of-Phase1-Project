document.addEventListener("DOMContentLoaded", () => { 

    const header = document.querySelector('h1');
    header.addEventListener('mouseover', () => {
        header.style.color = '#eecc99';
    });

    header.addEventListener('mouseleave', () => {
        header.style.color = 'black';
    });

    async function getRandomCatFact() {
        try {
            const response = await fetch('https://meowfacts.herokuapp.com/');
            const data = await response.json();
            displayCatFact(data.data[0]);
        } catch (error) {
            console.error('Error fetching cat fact:', error);
        }
    }

    function displayCatFact(fact) {
        document.getElementById('factDisplay').textContent = fact;
    }

    async function addNewCatFact(event) {
        event.preventDefault();
        const newFact = document.getElementById('newFactInput').value.trim();
        if (newFact) {
            addFactToDOM(newFact);
            await postNewFact(newFact);
            saveFacts();
            document.getElementById('newFactInput').value = '';
        }
    }

    function addFactToDOM(fact, liked = false, comments = []) {
        const factsList = document.getElementById('factsList');
        const listItem = document.createElement('li');
        
        const factText = document.createElement('span');
        factText.textContent = fact;
        listItem.appendChild(factText);

        const heartEmoji = document.createElement('span');
        heartEmoji.textContent = liked ? '❤️' : '♡';
        heartEmoji.style.cursor = 'pointer';
        heartEmoji.onclick = () => {
            liked = !liked;
            heartEmoji.textContent = liked ? '❤️' : '♡';
            saveFacts();
        };

        const deleteButton = createDeleteButton(listItem);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        buttonContainer.appendChild(heartEmoji);
        buttonContainer.appendChild(deleteButton);
        listItem.appendChild(buttonContainer);

        
        const commentSection = document.createElement('div');
        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Add a comment...';
        commentInput.className = 'comment-input';

        const commentButton = document.createElement('button');
        commentButton.textContent = 'Comment';
        commentButton.onclick = () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                addCommentToDOM(commentText, commentSection);
                comments.push(commentText);
                commentInput.value = '';
                saveFacts();
            }
        };

        commentSection.appendChild(commentInput);
        commentSection.appendChild(commentButton);
        listItem.appendChild(commentSection);

        comments.forEach(comment => addCommentToDOM(comment, commentSection));

        factsList.appendChild(listItem);
    }

    function addCommentToDOM(comment, commentSection) {
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        
        const commentText = document.createElement('span');
        commentText.textContent = `• ${comment}`;
    
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.style.marginLeft = '10px';
        removeButton.style.cursor = 'pointer';
    
        
        removeButton.onclick = () => {
            commentItem.remove();
            saveFacts();
        };
    
        commentItem.appendChild(commentText);
        commentItem.appendChild(removeButton);
    
        commentSection.appendChild(commentItem);
    }
    

    function createDeleteButton(listItem) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            listItem.remove();
            saveFacts();
        };
        return deleteButton;
    }

    async function postNewFact(fact) {
        try {
            await fetch('https://meowfacts.herokuapp.com/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: fact })
            });
        } catch (error) {
            console.error('Error posting new fact:', error);
        }
    }

    
    function saveFacts() {
        const factsList = document.getElementById('factsList');
        const facts = Array.from(factsList.children).map((listItem) => {
            const fact = listItem.childNodes[0].textContent.trim();
            const liked = listItem.querySelector('.button-container span').textContent === '❤️';
            const comments = Array.from(listItem.querySelectorAll('.comment-item')).map(commentItem => {
                return commentItem.childNodes[0].textContent.replace('• ', '').trim();
            });
            return { fact, liked, comments };
        });
        localStorage.setItem('catFacts', JSON.stringify(facts));
    }
    

    function loadFacts() {
        const facts = JSON.parse(localStorage.getItem('catFacts'));
        if (facts) {
            facts.forEach(({ fact, liked, comments }) => {
                addFactToDOM(fact, liked, comments);
            });
        }
    }

    window.onload = loadFacts;

    document.getElementById('getFactButton').addEventListener('click', getRandomCatFact);
    document.getElementById('addFactButton').addEventListener('click', addNewCatFact);

});
