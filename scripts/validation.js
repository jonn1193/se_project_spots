const validationConfig = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);

  if (errorMsgEl) {
    errorMsgEl.textContent = errorMsg;
    errorMsgEl.classList.add(config.errorClass);
    inputEl.classList.add(config.inputErrorClass);
  }
};

const hideInputError = (formEl, inputEl, config) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);

  if (errorMsgEl) {
    errorMsgEl.textContent = "";
    errorMsgEl.classList.remove(config.errorClass);
    inputEl.classList.remove(config.inputErrorClass);
  }
};

const checkInputValidity = (formEl, inputEl, config) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage, config);
  } else {
    hideInputError(formEl, inputEl, config);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputEl) => !inputEl.validity.valid);
};

const toggleButtonState = (inputList, buttonEl, config) => {
  if (hasInvalidInput(inputList)) {
    buttonEl.classList.add(config.inactiveButtonClass);
    buttonEl.disabled = true;
  } else {
    buttonEl.classList.remove(config.inactiveButtonClass);
    buttonEl.disabled = false;
  }
};

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonEl, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonEl, config);
    });
  });

  formEl.addEventListener("submit", (evt) => {
    evt.preventDefault();
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

const resetValidation = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonEl = formEl.querySelector(config.submitButtonSelector);

  inputList.forEach((inputEl) => {
    hideInputError(formEl, inputEl, config);
  });

  toggleButtonState(inputList, buttonEl, config);
};

const clearFormInputs = (formEl) => {
  const inputs = Array.from(formEl.querySelectorAll(".modal__input"));
  inputs.forEach((input) => {
    if (input.type !== "button" && input.type !== "submit") {
      input.value = "";
    }
  });
};

window.resetValidation = resetValidation;
window.clearFormInputs = clearFormInputs;
window.validationConfig = validationConfig;

document.addEventListener("DOMContentLoaded", () => {
  enableValidation(validationConfig);
});
