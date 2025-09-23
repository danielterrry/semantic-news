'use strict';
import styles from './featured-articles-layout.scss';
import articles from '../../data/articles.json';
import calendarIcon from '../../icons/calendar.svg';

(function () {
  class FeaturedArticlesLayout extends HTMLElement {
    articles = [];
    articlesWithNoImage = ['article-3', 'article-4'];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.articles = articles.data;

      const container = document.createElement('div');
      container.classList.add('cards');
      container.id = 'cards';

      const articlesHTML = this.articles
        .map((article) => {
          const plain = this.articlesWithNoImage.includes(article.id);
          const postedOn = new Date(article.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
          });

          return `
      <article class="card ${article.id}">
        ${
          !plain
            ? `
              <figure class="thumb-image">
                <img src="${article.image}" alt="${article.alt}" />
                <div class="overlay"></div>
              </figure>
            `
            : ''
        }
        <div class="content">
          <div class="date-posted">
            <div class="calendar-icon">
              <img src="${calendarIcon}" alt="Calendar Icon" />
            </div>
            <div class="article-date">${postedOn}</div>
          </div>
          <div class="article-title">
            <h2><a href="${article.link}">${article.title}</a></h2>
          </div>
          <div class="article-text">
            <p>${article.description}</p>
          </div>
          <div class="find-out-more">
            <a href="${article.list}">Read more</a>
          </div>
        </div>
      </article>
    `;
        })
        .join('');

      container.innerHTML = articlesHTML;

      const style = document.createElement('style');
      style.textContent = styles;
      this.shadowRoot.appendChild(style);

      this.shadowRoot.append(container);
      console.log('styles: ', styles);
    }

    connectedCallback() {
      this.setupHoverEvents();
    }

    setupHoverEvents() {
      this.articles.forEach((article, i) => {
        const isPopular = (i + 1) % 2 === 0;
        console.log(article.id);

        if (isPopular) {
          const articleElement = this.shadowRoot.querySelector(
            `.${article.id}`,
          );

          if (articleElement) {
            this.handleHover(articleElement);
          } else {
            console.log(
              `Article element with class name ${className} was not found.`,
            );
          }
        }
      });
    }

    handleHover(element) {
      let hoverBox;

      element.addEventListener('mouseenter', () => {
        hoverBox = document.createElement('div');
        hoverBox.textContent = 'Popular';

        Object.assign(hoverBox.style, {
          position: 'absolute',
          padding: '8px',
          backgroundColor: '#11263c',
          color: '#ffffff',
          zIndex: 1000,
          borderTopLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
        });

        const rect = element.getBoundingClientRect();
        hoverBox.style.top = `${rect.top + window.scrollY}px`;
        hoverBox.style.left = `${rect.left + window.scrollX}px`;
        document.body.appendChild(hoverBox);
      });

      element.addEventListener('mouseleave', () => {
        if (hoverBox) {
          document.body.removeChild(hoverBox);
          hoverBox = null;
        }
      });
    }
  }

  customElements.define('featured-articles-layout', FeaturedArticlesLayout);
})();
