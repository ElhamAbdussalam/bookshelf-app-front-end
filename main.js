let books = [];

const bookForm = document.getElementById('bookForm');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const searchForm = document.getElementById('searchBook');
const searchTitle = document.getElementById('searchBookTitle');

bookForm.addEventListener('submit', addBook);
searchForm.addEventListener('submit', searchBooks);

document.addEventListener('DOMContentLoaded', () => {
  const storageBook = localStorage.getItem('books');
  if (storageBook) {
    books = JSON.parse(storageBook);
  }
  renderBooks();
});

function addBook(event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value.trim();
  const author = document.getElementById('bookFormAuthor').value.trim();
  const year = Number(document.getElementById('bookFormYear').value.trim());
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (!title || !author || !year || isNaN(year)) {
    alert("Semua kolom harus diisi dengan benar!");
    return;
  }

  const newBook = {
    id: Date.now().toString(),
    title,
    author,
    year,
    isComplete
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
  bookForm.reset();
}

function renderBooks(filter = "") {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books
    .filter(book => book.title.toLowerCase().includes(filter.toLowerCase()))
    .forEach(book => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.appendChild(bookElement);
      } else {
        incompleteBookList.appendChild(bookElement);
      }
    });
}

function createBookElement(book) {
  const bookContainer = document.createElement('div');
  bookContainer.setAttribute('data-bookid', book.id);
  bookContainer.setAttribute('data-testid', 'bookItem');

  const titleElement = document.createElement('h3');
  titleElement.textContent = book.title;
  titleElement.setAttribute('data-testid', 'bookItemTitle');

  const authorElement = document.createElement('p');
  authorElement.textContent = `Penulis: ${book.author}`;
  authorElement.setAttribute('data-testid', 'bookItemAuthor');

  const yearElement = document.createElement('p');
  yearElement.textContent = `Tahun: ${book.year}`;
  yearElement.setAttribute('data-testid', 'bookItemYear');

  const buttonContainer = document.createElement('div');

  const completeButton = document.createElement('button');
  completeButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  completeButton.addEventListener('click', () => bookComplete(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.textContent = "Hapus Buku";
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = document.createElement('button');
  editButton.textContent = "Edit Buku";
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.addEventListener('click', () => editBook(book.id));

  buttonContainer.append(completeButton, editButton, deleteButton);

  bookContainer.append(titleElement, authorElement, yearElement, buttonContainer);

  return bookContainer;
}

function bookComplete(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
  }
}

function editBook(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    const titleInput = document.getElementById('bookFormTitle');
    const authorInput = document.getElementById('bookFormAuthor');
    const yearInput = document.getElementById('bookFormYear');
    const isCompleteInput = document.getElementById('bookFormIsComplete');

    titleInput.value = book.title;
    authorInput.value = book.author;
    yearInput.value = book.year;
    isCompleteInput.checked = book.isComplete;

    books = books.filter(b => b.id !== bookId);
    saveBooks();

    const submitButton = bookForm.querySelector('button[type="submit"]');
    submitButton.textContent = 'Update Buku'

    const updateBook = function(event) {
      event.preventDefault();

      const updatedTitle = titleInput.value.trim();
      const updatedAuthor = authorInput.value.trim();
      const updateYear = Number(yearInput.value.trim());
      const updatedIsComplete = isCompleteInput.checked;

      if (!updatedTitle || !updatedAuthor || !updateYear || isNaN(updateYear)) {
        alert('Semua kolom harus diisi dengan benar!');
        return;
      }

      const updateBook = {
        id: Date.now().toString(),
        title: updatedTitle,
        author: updatedAuthor,
        year: updateYear,
        isComplete: updatedIsComplete
      };

      books.push(updateBook);
      saveBooks();
      renderBooks();
      bookForm.reset();
      submitButton.textContent = 'Tambah Buku';

      bookForm.removeEventListener('submit', updateBook);
      bookForm.addEventListener('submit', addBook);
    };

    bookForm.removeEventListener('submit', addBook);
    bookForm.addEventListener('submit', updateBook);
  }
}

function deleteBook(bookId) {
  const confirmDelete = confirm("Apakah anda ingin menghapus buku ini?");
  if(confirmDelete){
    books = books.filter(b => b.id !== bookId);
    saveBooks();
    renderBooks();
  }
}

function searchBooks(event) {
  event.preventDefault();
  const filter = searchTitle.value.trim();
  renderBooks(filter);
}

function saveBooks(){
  localStorage.setItem('books', JSON.stringify(books));
}

renderBooks();
