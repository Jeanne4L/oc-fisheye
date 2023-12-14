import { cancelFocusTrap, focusTrap } from '../helpers/focusTrap.js';

const contactForm = () => {
	const displayModalButton = document.querySelector('#contact-button');
	const closeModalButton = document.querySelector('#contact-close-button');
	const contactForm = document.querySelector('#contact-form');
	const inputs = contactForm.elements;
	const sendButton = document.querySelector('#contact-form-send-button');

	const displayModal = () => {
		const modal = document.getElementById('contact-modal-overlay');
		modal.style.display = 'flex';
		document.body.style.overflow = 'hidden';

		inputs[0].focus();

		focusTrap(closeModalButton, sendButton);
	};

	const closeModal = () => {
		const modal = document.getElementById('contact-modal-overlay');
		modal.style.display = 'none';
		document.body.style.overflow = 'visible';

		contactForm.reset();

		cancelFocusTrap(closeModalButton, sendButton);
	};

	const submitForm = (e) => {
		e.preventDefault();

		for (let i = 0; i < inputs.length; i++) {
			if (inputs[i].nodeName === 'INPUT' || inputs[i].nodeName === 'TEXTAREA') {
				console.log(inputs[i].value);
			}
		}

		closeModal();
	};

	displayModalButton.addEventListener('click', displayModal);
	closeModalButton.addEventListener('click', closeModal);
	closeModalButton.addEventListener('keydown', (e) => {
		if (e.key == 'Enter') {
			closeModal();
		}
	});
	contactForm.addEventListener('submit', (e) => submitForm(e));
};

export default contactForm;
