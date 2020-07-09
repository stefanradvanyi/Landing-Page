(function() {
  /* Creating navigation and activates domSectionListener(), if DOM is loaded */
  document.addEventListener('DOMContentLoaded', function() {
    createNavigation();
    domSectionListener();
  });

  /**
   * @description This function listens to the DOM of the sections. If there is a change, it creates the navigation.
   */
  function domSectionListener() {
    const targetNode = document.querySelector('#main-content');
    const config = { childList: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          createNavigation();
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  /**
   * @description Create the navigation
   */
  function createNavigation() {
    const sections = getMainSections();
    const fragement = document.createDocumentFragment();
    const nav = document.querySelector('#navbar__list');
    // console.log(sections);
    for (section of sections) {
      const liItem = document.createElement('li');
      const aItem = `<a href='#'>${section.getAttribute('data-nav')}</a>`;
      liItem.innerHTML = aItem;
      fragement.appendChild(liItem);
    }

    nav.innerHTML = '';
    nav.appendChild(fragement);
  }

  /**
   * @description Selects the main sections
   * @return Returns the main sections
   */
  function getMainSections() {
    return document.querySelectorAll('.main-section');
  }

  /**
   * @description Checks which section is currently in the view
   * @return Returns the current section, which is in the view
   */
  function getSectiontInView() {
    const sections = getMainSections();
    let sectionCounter = 0;
    for (section of sections) {
      if (
        section.getBoundingClientRect().top > 0 &&
        section.getBoundingClientRect().bottom > 140
      ) {
        break;
      }
      sectionCounter++;
    }
    return sectionCounter;
  }

  document.addEventListener('scroll', function() {
    const currentSectionInView = getSectiontInView();
    console.log(currentSectionInView);
    // testa = checkSectionInView(sections[0]);
  });
})();
