let firstEltHandler, lastEltHandler;

export const focusTrap = (elt, firstElt, lastElt) => {
	const { children } = elt;

	if (firstElt === null && lastElt === null) {
		firstElt = children[0];
		lastElt = children[children.length - 1];
	}

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

export const cancelFocusTrap = (elt, firstElt, lastElt) => {
	const { children } = elt;

	if (firstElt === null && lastElt === null) {
		firstElt = children[0];
		lastElt = children[children.length - 1];
	}

	firstElt.removeEventListener('keydown', firstEltHandler);
	lastElt.removeEventListener('keydown', lastEltHandler);
};
