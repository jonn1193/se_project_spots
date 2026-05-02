import {
  enableValidation,
  validationConfig,
  resetValidation,
} from "../scripts/validation.js";
import "./index.css";
import avatarImage from "../images/avatar.jpg";
import logoImage from "../images/logo.svg";
import pencilImage from "../images/pencil.svg";
import plusImage from "../images/plus.svg";
import Api from "../utils/Api.js";

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", closeOnEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", closeOnEscape);
}

function closeOnEscape(evt) {
  if (evt.key === "Escape") {
    const activeModal = document.querySelector(".modal_is-opened");
    if (activeModal) {
      closeModal(activeModal);
    }
  }
}

function renderLoading(isLoading, button, loadingText, defaultText) {
  button.textContent = isLoading ? loadingText : defaultText;
}

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ba1ab048-164c-4e75-9e71-922d294c9b0f",
    "Content-Type": "application/json",
  },
});

const profileAvatar = document.querySelector(".profile__avatar");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const headerLogo = document.querySelector(".header img");
const editButtonIcon = document.querySelector(".profile__edit-button img");
const addButtonIcon = document.querySelector(".profile__add-button img");
const avatarModalButton = document.querySelector(".profile__avatar-button");

profileAvatar.src = avatarImage;
headerLogo.src = logoImage;
editButtonIcon.src = pencilImage;
addButtonIcon.src = plusImage;

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button",
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileSubmitButton = editProfileForm.querySelector(
  ".modal__submit-button",
);
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostSubmitButton = newPostForm.querySelector(".modal__submit-button");
const cardImageInput = newPostModal.querySelector("#card-image-input");
const cardDescriptionInput = newPostModal.querySelector(
  "#card-description-input",
);

const avatarModal = document.querySelector("#avatar-modal");
const avatarCloseButton = avatarModal.querySelector(".modal__close-button");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitButton = avatarForm.querySelector(".modal__submit-button");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteCloseButton = deleteModal.querySelector(".modal__close-button");
const deleteForm = deleteModal.querySelector("#delete-form");
const deleteSubmitButton = deleteForm.querySelector(".modal__submit-button");
const deleteCancelButton = deleteForm.querySelector(".modal__cancel-button");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button",
);

let selectedCard = null;
let selectedCardId = null;

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target === modal) {
      closeModal(modal);
    }
  });
});

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_active");
  }

  cardImage.addEventListener("click", function () {
    previewModalCaption.textContent = data.name;
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    openModal(previewModal);
  });

  cardLikeButton.addEventListener("click", function () {
    const likeMethod = cardLikeButton.classList.contains(
      "card__like-button_active",
    )
      ? api.unlikeCard(data._id)
      : api.likeCard(data._id);

    likeMethod
      .then((updatedCard) => {
        cardLikeButton.classList.toggle(
          "card__like-button_active",
          updatedCard.isLiked,
        );
      })
      .catch(console.error);
  });

  cardDeleteButton.addEventListener("click", function () {
    handleDeleteCard(cardElement, data);
  });

  return cardElement;
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, deleteSubmitButton, "Deleting...", "Delete");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
      selectedCard = null;
      selectedCardId = null;
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, deleteSubmitButton, "Deleting...", "Delete");
    });
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, validationConfig);
  openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

avatarModalButton.addEventListener("click", function () {
  resetValidation(avatarForm, validationConfig);
  openModal(avatarModal);
});

avatarCloseButton.addEventListener("click", function () {
  closeModal(avatarModal);
});

deleteCloseButton.addEventListener("click", function () {
  closeModal(deleteModal);
});

deleteCancelButton.addEventListener("click", function () {
  closeModal(deleteModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, editProfileSubmitButton, "Saving...", "Save");

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, editProfileSubmitButton, "Saving...", "Save");
    });
}

function handleNewPostSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, newPostSubmitButton, "Saving...", "Save");

  api
    .addCard({
      name: cardDescriptionInput.value,
      link: cardImageInput.value,
    })
    .then((data) => {
      const newCardElement = getCardElement(data);
      cardsList.prepend(newCardElement);
      newPostForm.reset();
      resetValidation(newPostForm, validationConfig);
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, newPostSubmitButton, "Saving...", "Save");
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(true, avatarSubmitButton, "Saving...", "Save");

  api
    .editAvatarInfo(avatarInput.value)
    .then((data) => {
      profileAvatar.src = data.avatar;
      avatarForm.reset();
      resetValidation(avatarForm, validationConfig);
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      renderLoading(false, avatarSubmitButton, "Saving...", "Save");
    });
}

api
  .getAppInfo()
  .then(([cards, user]) => {
    profileAvatar.src = user.avatar;
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;

    cards.forEach(function (item) {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleNewPostSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(validationConfig);