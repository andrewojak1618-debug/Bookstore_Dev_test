const booksGrid = document.querySelector('.books_grid');
const storageKey = 'bookstore-card-state';

function loadSavedBooks() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch (error) {
    localStorage.removeItem(storageKey);
    return {};
  }
}

const savedBooks = loadSavedBooks();

books.forEach((book) => {
  const savedBook = savedBooks[book.name];

  if (savedBook) {
    book.likes = savedBook.likes;
    book.liked = savedBook.liked;
    book.comments = savedBook.comments;
  }
});

function saveBooks() {
  const state = {};

  books.slice(0, 3).forEach((book) => {
    state[book.name] = {
      likes: book.likes,
      liked: book.liked,
      comments: book.comments,
    };
  });

  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatPrice(price) {
  return `${price.toFixed(2).replace('.', ',')} \u20ac`;
}

function createCommentItem(comment) {
  const item = document.createElement('li');
  const name = document.createElement('span');
  const text = document.createElement('span');

  name.className = 'book_comment_name';
  text.className = 'book_comment_text';
  name.textContent = `[${comment.name}]`;
  text.textContent = `: ${comment.comment}`;

  item.append(name, text);

  return item;
}

function renderComments(list, comments) {
  list.innerHTML = '';

  comments.forEach((comment) => {
    list.append(createCommentItem(comment));
  });

  list.scrollTop = list.scrollHeight;
}

function createBookCard(book, bookIndex) {
  const card = document.createElement('article');
  const title = document.createElement('h2');
  const header = document.createElement('div');
  const visual = document.createElement('div');
  const content = document.createElement('div');
  const actions = document.createElement('div');
  const price = document.createElement('span');
  const likesWrapper = document.createElement('div');
  const likesCount = document.createElement('span');
  const likeButton = document.createElement('button');
  const meta = document.createElement('dl');
  const commentsSection = document.createElement('section');
  const commentsTitle = document.createElement('h3');
  const commentsList = document.createElement('ul');
  const commentForm = document.createElement('form');
  const commentInput = document.createElement('input');
  const commentButton = document.createElement('button');
  const cover = document.createElement('div');
  const coverImage = document.createElement('img');
  const coverButton = document.createElement('button');

  card.className = 'book_card';
  header.className = 'book_card_header';
  title.className = 'book_card_title';
  visual.className = 'book_card_visual';
  content.className = 'book_card_content';
  actions.className = 'book_card_actions';
  price.className = 'book_card_price';
  likesWrapper.className = 'book_card_likes';
  meta.className = 'book_card_meta';
  commentsSection.className = 'book_card_comments';
  commentsList.className = 'book_comments_list';
  commentForm.className = 'book_comment_form';
  commentInput.className = 'book_comment_input';
  likeButton.className = 'like_button';
  commentButton.className = 'comment_button';
  cover.className = 'book_card_cover';
  coverImage.className = 'book_card_image';
  coverButton.className = 'cover_toggle_button';

  title.textContent = book.name;
  price.textContent = formatPrice(book.price);
  likesCount.textContent = book.likes;
  likeButton.type = 'button';
  likeButton.textContent = '\u2665';
  likeButton.setAttribute('data-melt-toggle-trigger', '');
  likeButton.setAttribute('aria-label', `${book.name} favorisieren`);
  likeButton.setAttribute('aria-pressed', String(book.liked));

  if (book.liked) {
    likeButton.setAttribute('data-checked', '');
  }

  [
    ['Author', book.author],
    ['Jahr', book.publishedYear],
    ['Genre', book.genre],
  ].forEach(([label, value]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');

    term.textContent = label;
    description.textContent = `: ${value}`;
    row.append(term, description);
    meta.append(row);
  });

  commentsTitle.textContent = 'Kommentare:';
  commentInput.type = 'text';
  commentInput.placeholder = 'Schreibe dein Kommentar ...';
  commentInput.setAttribute('aria-label', `Kommentar zu ${book.name} schreiben`);
  commentButton.type = 'submit';
  commentButton.textContent = '\u27a4';
  commentButton.setAttribute('aria-label', 'Kommentar senden');

  if (bookIndex === 0) {
    let isBackCoverVisible = false;

    coverImage.src = './assets/images/front_thesecret.jpg';
    coverImage.alt = `Vorderseite von ${book.name}`;
    coverButton.type = 'button';
    coverButton.textContent = 'Rückseite';
    coverButton.setAttribute('aria-pressed', 'false');

    coverButton.addEventListener('click', () => {
      isBackCoverVisible = !isBackCoverVisible;

      if (isBackCoverVisible) {
        coverImage.src = './assets/images/back_thesecret.jpg';
        coverImage.alt = `Rückseite von ${book.name}`;
        coverButton.textContent = 'Vorderseite';
      } else {
        coverImage.src = './assets/images/front_thesecret.jpg';
        coverImage.alt = `Vorderseite von ${book.name}`;
        coverButton.textContent = 'Rückseite';
      }

      coverButton.setAttribute('aria-pressed', String(isBackCoverVisible));
    });

    cover.append(coverImage, coverButton);
    visual.append(cover);
  }

  likeButton.addEventListener('click', () => {
    book.liked = !book.liked;
    book.likes += book.liked ? 1 : -1;

    likesCount.textContent = book.likes;
    likeButton.setAttribute('aria-pressed', String(book.liked));

    if (book.liked) {
      likeButton.setAttribute('data-checked', '');
    } else {
      likeButton.removeAttribute('data-checked');
    }

    saveBooks();
  });

  commentForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const commentText = commentInput.value.trim();

    if (!commentText) {
      return;
    }

    book.comments.push({
      name: 'Gast',
      comment: commentText,
    });

    commentInput.value = '';
    renderComments(commentsList, book.comments);
    saveBooks();
  });

  renderComments(commentsList, book.comments);

  header.append(title);
  likesWrapper.append(likesCount, likeButton);
  actions.append(price, likesWrapper);
  commentForm.append(commentInput, commentButton);
  commentsSection.append(commentsTitle, commentsList, commentForm);
  content.append(actions, meta);
  card.append(header, visual, content, commentsSection);

  return card;
}

books.slice(0, 3).forEach((book, bookIndex) => {
  booksGrid.append(createBookCard(book, bookIndex));
});
