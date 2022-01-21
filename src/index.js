let quoteList = document.querySelector('#quote-list')
let form = document.querySelector('#new-quote-form')

document.addEventListener('DOMContentLoaded', getQuote)

function getQuote() {
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(data => data.forEach(data => renderQuote(data)))
}

function renderQuote(data) {
    let quote = document.createElement('li')
    quote.id = data.id
    quote.innerHTML = `
        <blockquote class="blockquote">
            <p clas="mb-0">${data.quote}</p>
            <footer class="blockquote-footer">${data.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>0</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
    `
    quoteList.appendChild(quote)
    quote.querySelector('.btn-danger').addEventListener('click', () => {
        quote.remove()
        deleteQuote(quote.id)
    })
    quote.querySelector('.btn-success').addEventListener('click', () => addLike(quote))
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
    console.log(id)
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'applicaton/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(quote)
    })
    .then(res => res.json())
    .then(data => console.log(data))
}