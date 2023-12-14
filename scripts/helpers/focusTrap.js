let firstEltHandler, lastEltHandler;

export const focusTrap = (firstElt, lastElt) => {
	firstEltHandler = (e) => {
		if (e.shiftKey && e.key == 'Tab') {
			lastElt.focus();
			e.preventDefault();
		}
	};

	lastEltHandler = (e) => {
		if (!e.shiftKey && e.key == 'Tab') {
			firstElt.focus();
			e.preventDefault();
		}
	};

	firstElt.addEventListener('keydown', firstEltHandler);
	lastElt.addEventListener('keydown', lastEltHandler);
};

export const cancelFocusTrap = (firstElt, lastElt) => {
	firstElt.removeEventListener('keydown', firstEltHandler);
	lastElt.removeEventListener('keydown', lastEltHandler);
};
