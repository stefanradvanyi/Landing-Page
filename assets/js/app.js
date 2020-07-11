(function() {
  // Checks if after scrolling the section has changed
  let oldSectionInView = null;
  let windowHeight = null;
  let scrollStatus = false;
  let numberSections = 0;

  /* Activates functions, if DOM is loaded */
  document.addEventListener('DOMContentLoaded', function() {
    createNavigation();
    mobileMenu();
    highlightNavigation(getSectiontInView());
    domSectionListener();
    scrollToSection();
    windowHeight = window.innerHeight;
    scrollToTop();
    scrollToTopVisibility();
    calcScrollToTopPosition();
    formNewSection();
    numberSections = getNumberSections();
  });

  document.addEventListener('scroll', function() {
    highlightNavigation(getSectiontInView());
    scrollToTopVisibility();
  });

  window.addEventListener('resize', function() {
    calcScrollToTopPosition();
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
          oldSectionInView = null;
          createNavigation();
          highlightNavigation(getSectiontInView());
          scrollToSection();
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
    const nav = document.querySelector('#main-menu ul');
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
    hideMobileMenuIfClicked();
  }

  /**
   * @description Closes the mobile menu, if user clicks on an item.
   */
  function hideMobileMenuIfClicked() {
    const nav = document.querySelectorAll('#main-menu li a');
    nav.forEach(navItem =>
      navItem.addEventListener('click', function() {
        const body = document.querySelector('body');
        if (body.classList.contains('show')) {
          body.classList.toggle('show');
        }
      })
    );
  }

  /**
   * @description Open & close mobile menu
   */
  function mobileMenu() {
    const selector = document.querySelectorAll('.open-btn, .close-btn');
    const selectorBody = document.querySelector('body');
    const menuStatus = 0;
    selector.forEach(select =>
      select.addEventListener('click', e => {
        selectorBody.classList.toggle('show');
        const sheet = window.document.styleSheets[0];
        if (menuStatus === 0) {
          sheet.insertRule(
            '#main-menu { transition: ease-in-out; transition-duration: 0.8s;}',
            sheet.cssRules.length
          );
          menuStatus = 1;
        } else {
          setTimeout(() => {
            sheet.removeRule(sheet.cssRules.length - 1);
          }, 1000);
          menuStatus = 0;
        }
      })
    );
  }

  /**
   * @description Selects the main sections
   * @return Returns the main sections
   */
  function getMainSections() {
    return document.querySelectorAll('.main-section');
  }

  /**
   * @description Counts number of sections
   * @return Returns number of sections
   */
  function getNumberSections() {
    return document.querySelectorAll('.main-section').length;
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
    // Just change classes (removing & adding) if section in the view is has changed
    if (oldSectionInView !== currentSectionInView) {
      const getNaviItems = document.querySelectorAll('#main-menu a');
      getNaviItems.forEach(item => item.classList.remove('show'));
      getNaviItems[currentSectionInView].classList.add('show');
      oldSectionInView = currentSectionInView;
    }
  }

  /**
   * @description Scroll to the section by clicking on the navigation
   */
  function scrollToSection() {
    const getNaviItems = document.querySelectorAll('#main-menu a');
    getNaviItems.forEach(item =>
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
      })
    );
  }

  /**
   * @description Calculates for scrollToTop button CSS 'left' position
   */
  function calcScrollToTopPosition() {
    const scrolToTopPosition = document
      .querySelector('#main-content')
      .getBoundingClientRect().right;
    const scrollToTop = document.querySelector('#scrollToTop');
    scrollToTop.style.left = `${scrolToTopPosition - 50}px`;
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

  /**
   * @description Validation of form and invokes createNewSection()
   */
  function formNewSection() {
    const addNewSectionButton = document.querySelector('#buttonNewSection');
    addNewSectionButton.addEventListener('click', function() {
      const validation = formValidation();
      if (validation) {
        createNewSection();
        formClear();
      }
    });
  }

  /**
   * @description Creates the entire new section (html + content)
   */
  function createNewSection() {
    numberSections++;
    const section = document.createElement('section');
    section.setAttribute('id', `section${numberSections}`);
    section.setAttribute(
      'data-nav',
      `${document.querySelector('#inputSectionNav').value}`
    );
    section.setAttribute('class', 'main-section');
    const div = document.createElement('div');
    div.setAttribute('class', 'landing__container');
    const header = document.createElement('h2');
    header.innerHTML = document.querySelector('#inputSectionHeader').value;
    const content = document.createElement('p');
    content.innerHTML = document.querySelector('#inputSectionText').value;
    div.appendChild(header);
    div.appendChild(content);
    section.appendChild(div);
    document.querySelector('#main-content').appendChild(section);
  }

  /**
   * @description Check if all form fields aren' blank
   */
  function formValidation() {
    let validation = false;

    if (
      document.querySelector('#inputSectionHeader').value.length > 0 &&
      document.querySelector('#inputSectionText').value.length > 0 &&
      document.querySelector('#inputSectionText').value.length > 0
    ) {
      validation = true;
    }
    return validation;
  }

  /**
   * @description Clears the form
   */
  function formClear() {
    document.querySelector('#inputSectionHeader').value = '';
    document.querySelector('#inputSectionNav').value = '';
    document.querySelector('#inputSectionText').value = '';
  }
})();
