const displayModalButton = document.querySelector('#contact-button');
const closeModalButton = document.querySelector('#contact-close-button');

const displayModal = () => {
	const modal = document.getElementById('contact-modal-overlay');
	modal.style.display = 'flex';
	document.body.style.overflow = 'hidden';
};

const closeModal = () => {
	const modal = document.getElementById('contact-modal-overlay');
	modal.style.display = 'none';
	document.body.style.overflow = 'visible';
};

displayModalButton.addEventListener('click', displayModal);
closeModalButton.addEventListener('click', closeModal);
