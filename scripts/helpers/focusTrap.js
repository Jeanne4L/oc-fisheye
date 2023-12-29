let firstEltHandler; 
let lastEltHandler;

export const focusTrap = (elt, firstElt, lastElt) => {
  const { children } = elt;

  let firstEltToFocus = firstElt;
  let lastEltToFocus = lastElt;

  if (!firstEltToFocus && !lastEltToFocus) {
    [firstEltToFocus, lastEltToFocus] = [children[0], children[children.length - 1]];
  }

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

export const cancelFocusTrap = (elt, firstElt, lastElt) => {
  const { children } = elt;

  let firstEltToFocus = firstElt;
  let lastEltToFocus = lastElt;

  if (firstEltToFocus === null && lastElt === null) {
    [firstEltToFocus, lastEltToFocus] = [children[0], children[children.length - 1]];
  }

  firstEltToFocus.removeEventListener('keydown', firstEltHandler);
  lastEltToFocus.removeEventListener('keydown', lastEltHandler);
};
