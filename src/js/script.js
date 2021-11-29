
{
  'use strict';
  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      image: '.book__image',
      list: '.books-list',
      filters: '.filters'
    }
  };
  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  };
  const filters = [];
  class BookList{
    constructor(){
      const thisBookList = this;
      thisBookList.render();
      thisBookList.initActions();
    }
    initData() {
      this.data = dataSource.books;
    }

    render(){
      const thisBookList = this;
      for(let book of dataSource.books){
        const bookData = {
          id: book.id,
          name: book.name,
          price: book.price,
          rating: book.rating,
          image: book.image,
        };
        const ratingBgc = thisBookList.determineRatingBgc(bookData.rating);
        bookData.ratingBgc = ratingBgc;
        const ratingWidth = bookData.rating * 10;
        bookData.ratingWidth = ratingWidth;
        const generatedHTML = templates.book(bookData);
        thisBookList.element = utils.createDOMFromHTML(generatedHTML);
        const containerOfList = document.querySelector(select.containerOf.list);
        containerOfList.appendChild(thisBookList.element);
      }
    }
    initActions(){
      const thisBookList = this;
      const favouriteBooks = [];
      thisBookList.element = document.querySelector(select.containerOf.list);
      // const bookImages = booksList.querySelectorAll(select.containerOf.image);
      // for(let image of bookImages){
      thisBookList.element.addEventListener('dblclick', function(event){
        event.preventDefault();
        const image = event.target.offsetParent;
        const bookID = image.getAttribute('data-id');

        if(favouriteBooks.includes(bookID)){
          image.classList.remove('favorite');
          favouriteBooks.pop(bookID);  /* pop usuwa ostatni element z tablicy */
        }else{
          image.classList.add('favorite');
          favouriteBooks.push(bookID);
        }
      });
      // const filters = [];
      const filterBooks = document.querySelector(select.containerOf.filters);
      filterBooks.addEventListener('click', function(event){
        const clickedElm = event.target;
        if(clickedElm.tagName == 'INPUT' && clickedElm.type == 'checkbox' && clickedElm.name == 'filter'){
          if(clickedElm.checked){
            filters.push(clickedElm.value);
          }else{
            const valueIndex = filters.indexOf(clickedElm.value);
            filters.splice(valueIndex, 1);
          }
        }
        thisBookList.category();
      });
    }

    category(){
      for(let book of dataSource.books){
        const filteredBook  = document.querySelector('.book__image[data-id="' + book.id + '"]');
        let shouldBeHidden = false;
        for( const filter of filters){
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }
        if(shouldBeHidden === true){
          filteredBook.classList.add('hidden');
        }else{
          filteredBook.classList.remove('hidden');
        }


      }
    }
    determineRatingBgc(rating){
      let background = '';
      if(rating < 6){
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if(rating > 6 && rating <= 8){
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if(rating > 8 && rating <= 9){
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }else if(rating > 9){
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }

      return background;
    }
  }
  new BookList();
}
