(function() {
  // Checks if after scrolling the section has changed
  let oldSectionInView = null;
  let windowHeight = null;
  let scrollStatus = false;
  /* Creating navigation + hightlighting and activates domSectionListener(), if DOM is loaded */
  document.addEventListener('DOMContentLoaded', function() {
    createNavigation();
    highlightNavigation(getSectiontInView());
    domSectionListener();
    scrollToSection();
    windowHeight = window.innerHeight;
    scrollToTop();
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
          highlightNavigation(getSectiontInView());
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  /**
   * @description Creates the navigation
   */
  function createNavigation() {
    const sections = getMainSections();
    const fragement = document.createDocumentFragment();
    const nav = document.querySelector('#navbar__list');
    // console.log(sections);
    for (section of sections) {
      const liItem = document.createElement('li');
      const aItem = `<a href="#${section.getAttribute(
        'id'
      )}">${section.getAttribute('data-nav')}</a>`;
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
        section.getBoundingClientRect().top > 0 ||
        section.getBoundingClientRect().bottom > 160
      ) {
        break;
      }
      sectionCounter++;
    }

    return sectionCounter;
  }

  /**
   * @description Adding a class to the navigation to show which secition is in the view
   * @param {currentSectionInView} Contains the section number which is currently in the view
   */
  function highlightNavigation(currentSectionInView) {
    const getNaviItems = document.querySelectorAll('#navbar__list a');
    // Just change classes (removing & adding) if section in the view is another one
    if (oldSectionInView !== currentSectionInView) {
      getNaviItems.forEach(item => item.classList.remove('show'));
      getNaviItems[currentSectionInView].classList.add('show');
      oldSectionInView = currentSectionInView;
    }
  }

  /**
   * @description Scroll to the section by clicking on the navigation
   */
  function scrollToSection() {
    const getNaviItems = document.querySelectorAll('#navbar__list a');
    getNaviItems.forEach(item =>
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
      })
    );
  }

  /**
   * @description Shows and hides scrollToTop button
   */
  function scrollToTopVisibility() {
    const checkPosition =
      document.querySelector('#main-content').getBoundingClientRect().top +
      windowHeight;
    if (checkPosition < 500 && scrollStatus === false) {
      document.querySelector('#scrollToTop').classList.toggle('show');
      scrollStatus = true;
    } else if (checkPosition > 500 && scrollStatus === true) {
      document.querySelector('#scrollToTop').classList.toggle('show');
      scrollStatus = false;
    }
  }

  /**
   * @description Scroll to top if clicking on button
   */
  function scrollToTop() {
    const scrollToTopButton = document.querySelector('#scrollToTop');
    scrollToTopButton.addEventListener('click', function() {
      document.querySelector('html').scrollIntoView({ behavior: 'smooth' });
    });
  }

  document.addEventListener('scroll', function() {
    highlightNavigation(getSectiontInView());
    scrollToTopVisibility();
  });
})();
