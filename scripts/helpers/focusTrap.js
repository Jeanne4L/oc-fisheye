let firstEltHandler;
let lastEltHandler;

export const focusTrap = (elt) => {
  const focusableElts = elt.querySelectorAll('button, textarea, input[type="text"], select, li');

  const firstEltToFocus = focusableElts[0];
  const lastEltToFocus = focusableElts[focusableElts.length - 1];

  firstEltHandler = (e) => {
    if (e.shiftKey && e.key === 'Tab') {
      lastEltToFocus.focus();
      e.preventDefault();
    }
  };

  lastEltHandler = (e) => {
    if (!e.shiftKey && e.key === 'Tab') {
      firstEltToFocus.focus();
      e.preventDefault();
    }
  };

  firstEltToFocus.addEventListener('keydown', firstEltHandler);
  lastEltToFocus.addEventListener('keydown', lastEltHandler);
};

export const cancelFocusTrap = (elt) => {
  const focusableElts = elt.querySelectorAll('button, textarea, input[type="text"], select, li');
  const firstEltToFocus = focusableElts[0];
  const lastEltToFocus = focusableElts[focusableElts.length - 1];

  firstEltToFocus.removeEventListener('keydown', firstEltHandler);
  lastEltToFocus.removeEventListener('keydown', lastEltHandler);
};
