document.addEventListener("DOMContentLoaded" , () => {

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
    
    
    function addFactToDOM(fact) {
        const factsList = document.getElementById('factsList');
        const listItem = document.createElement('li');
        listItem.textContent = fact;
        listItem.appendChild(createDeleteButton(listItem));
        factsList.appendChild(listItem);
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
        const factsList = document.getElementById('factsList').innerHTML;
        localStorage.setItem('catFacts', factsList);
    }
    
    
    function loadFacts() {
        const facts = localStorage.getItem('catFacts');
        if (facts) {
            document.getElementById('factsList').innerHTML = facts;
        }
    }
    
    window.onload = loadFacts;
    
    
    document.getElementById('getFactButton').addEventListener('click', getRandomCatFact);
    document.getElementById('addFactButton').addEventListener('click', addNewCatFact);
    
    const header = document.querySelector('h1')
    header.addEventListener('mouseover' , () => {
        header.style.color = '#eecc99'
    })

    header.addEventListener('mouseleave', () => {
        header.style.color = 'black'
    })
    
    

})


