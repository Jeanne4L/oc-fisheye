let firstElementHandler;
let lastElementHandler;

export const focusTrap = (element) => {
  const focusableElements = element.querySelectorAll('button, textarea, input[type="text"], select, li');

  const firstElementToFocus = focusableElements[0];
  const lastElementToFocus = focusableElements[focusableElements.length - 1];

  firstElementHandler = (e) => {
    if (e.shiftKey && e.key === 'Tab') {
      lastElementToFocus.focus();
      e.preventDefault();
    }
  };

  lastElementHandler = (e) => {
    if (!e.shiftKey && e.key === 'Tab') {
      firstElementToFocus.focus();
      e.preventDefault();
    }
  };

  firstElementToFocus.addEventListener('keydown', firstElementHandler);
  lastElementToFocus.addEventListener('keydown', lastElementHandler);
};

export const cancelFocusTrap = (element) => {
  const focusableElements = element.querySelectorAll('button, textarea, input[type="text"], select, li');
  const firstElementToFocus = focusableElements[0];
  const lastElementToFocus = focusableElements[focusableElements.length - 1];

  firstElementToFocus.removeEventListener('keydown', firstElementHandler);
  lastElementToFocus.removeEventListener('keydown', lastElementHandler);
};
