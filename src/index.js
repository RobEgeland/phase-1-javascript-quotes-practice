let quoteList = document.querySelector('#quote-list');
let form = document.querySelector('#new-quote-form');
let hiddenForm = document.querySelector('#hidden-form')
let hiddenText = document.querySelector('#hiddenText');
let hiddenSubmit = document.querySelector('#hidden-submit')



document.addEventListener('DOMContentLoaded', getQuotes)


function getQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quotes => renderAllQuotes(quotes))
}


function getSingleQuote(quoteData) {
    let likes;
    //console.log(data)
    //debugger
    fetch(`http://localhost:3000/likes?quoteId=${quoteData.id}`)
    .then(res => res.json())
    .then(data => {
        console.log("data", data)
        likes = data.length
        renderQuote(quoteData, likes)
    })}

function renderQuote(data, likes) {
    console.log("like", likes)
    console.log('data', data)
    let quote = document.createElement('li')
    quote.id = data.id
    quote.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${data.quote}</p>
    <footer class="blockquote-footer">${data.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${likes}</span></button>
    <button class='btn-danger'>Delete</button>
    <button class='btn-edit'>Edit</button>
    </blockquote>
    `
    
    quoteList.appendChild(quote)
    
    console.log()
    quote.querySelector('.btn-danger').addEventListener('click', () => {
        quote.remove()
        deleteQuote(quote.id)
    })
    quote.querySelector('.btn-success').addEventListener('click', () => addLike(quote))
    quote.querySelector('.btn-edit').addEventListener('click', () => editQuote(quote))
    
}

function renderAllQuotes(quotes) {
    quotes.forEach(getSingleQuote)

}

form.addEventListener('submit', createQuote)

function createQuote(e) {
    let quoteForm = {
        id: '',
        quote:e.target.newQuote.value,
        author:e.target.author.value,
        likes:[]
    }
    postQuote(quoteForm)
}

function postQuote(quoteForm) {
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteForm)
    })
    getQuote()
}


function deleteQuote(id) {
    fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}





function addLike(quote) {
    let likeNum = quote.querySelector('span')
    likeNum.textContent++

    let id = quote.id;
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({'quoteId': id})
    })

}


function editQuote(quote) {
    hiddenSubmit.type = 'submit'
    hiddenText.type = 'text'
    hiddenText.value = quote.querySelector('p').textContent
    hiddenForm.id = quote.id
}

hiddenForm.addEventListener('submit', saveQuote)

function saveQuote(e) {
    fetch(`http://localhost:3000/quotes/${e.target.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'quote': e.target.hiddenText.value})
    })
    renderAllQuotes
}