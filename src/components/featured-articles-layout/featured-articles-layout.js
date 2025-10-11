'use strict';
import styles from './featured-articles-layout.scss';
import calendarIcon from '../../icons/calendar.svg';

(function () {
  class FeaturedArticlesLayout extends HTMLElement {
    articles = [];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
      this.articles = await this.getNews();
      this.displayArticles();
      this.setupHoverEvents();
    }

    async getNews() {
      try {
        const response = await fetch(`${process.env.API_BASE_URL}/news`);
        if (response.status !== 200) throw new Error('Failed to fetch news.');
        const { data } = await response.json();

        return data;
      } catch (error) {
        console.error('ERROR:', error);
      }
    }

    setupHoverEvents() {
      this.articles.forEach((_, index) => {
        const isPopular = (index + 1) % 2 === 0;

        if (isPopular) {
          const articleElement =
            this.shadowRoot.querySelectorAll('.card')[index];

          if (articleElement) {
            this.handleHover(articleElement);
          } else {
            console.log(`Article card at ${index} was not found.`);
          }
        }
      });
    }

    displayArticles() {
      const container = document.createElement('div');
      container.classList.add('cards');
      container.id = 'cards';

      const articlesHTML = this.articles
        .map((article, index) => {
          const className = `article-${index + 1}`;
          const postedOn = new Date(article.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
          });

          return `
      <article class="card ${className}">
        ${
          ![2, 3].includes(index)
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
