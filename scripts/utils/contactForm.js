import { cancelFocusTrap, focusTrap } from '../helpers/focusTrap.js';

const displayContactModal = () => {
  const modalOverlay = document.getElementById('contact-modal-overlay');
  const modal = document.querySelector('.contact-modal');
  const displayModalButton = document.querySelector('#contact-button');
  const closeModalButton = document.querySelector('#contact-close-button');
  const contactForm = document.querySelector('#contact-form');
  const inputs = contactForm.elements;

  const displayModal = () => {
    modalOverlay.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    inputs[0].focus();

    focusTrap(modal);
  };

  const closeModal = () => {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'visible';
    modalOverlay.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-modal', 'false');

    contactForm.reset();

    cancelFocusTrap(modal);

    setTimeout(() => {
      displayModalButton.focus();
    }, 0);
  };

  const submitForm = (e) => {
    e.preventDefault();

    [...inputs].forEach((input) => {
      if (['INPUT', 'TEXTAREA'].includes(input.nodeName)) {
        console.log(input.value);
      }
    });

    closeModal();
  };

  displayModalButton.addEventListener('click', displayModal);
  closeModalButton.addEventListener('click', closeModal);
  closeModalButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      closeModal();
    }
  });
  contactForm.addEventListener('submit', (e) => submitForm(e));
};

export default displayContactModal;
