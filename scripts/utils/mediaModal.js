document.addEventListener('DOMContentLoaded', function () {
	const medias = document.querySelectorAll('.media');
	const closeButton = document.querySelector('#contact-close-button');

	const displayMediaModal = () => {
		const modal = document.getElementById('media-modal-overlay');
		modal.style.display = 'block';
	};

	const closeMediaModal = () => {
		const modal = document.getElementById('media-modal-overlay');
		modal.style.display = 'none';
	};

	medias.forEach((media) => {
		media.addEventListener('click', displayMediaModal);
	});

	closeButton.addEventListener('click', closeMediaModal);
});
