const displayModalButton = document.querySelector('#contact-button');
const closeModalButton = document.querySelector('#close-button');

const displayModal = () => {
	const modal = document.getElementById('contact-modal');
	modal.style.display = 'block';
};

const closeModal = () => {
	const modal = document.getElementById('contact-modal');
	modal.style.display = 'none';
};

displayModalButton.addEventListener('click', displayModal);
closeModalButton.addEventListener('click', closeModal);
