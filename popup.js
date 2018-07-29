let noMoHistoryData = JSON.parse(localStorage.getItem('noMoHistory')) || [];
const domainSection = $('.domain-section');
let dataSet = new Set(noMoHistoryData);
let numInputs = 0;
let hidden = true;

if (noMoHistoryData.length) {
  dataSet.forEach(val => {
    createInput(val);
  });
}

// toggle between eye icons and hidden text input

$('.eye').click(() => {
  if (hidden) {
    $('.eye > i')
      .removeClass('fa-eye-slash')
      .addClass('fa-eye');
    $('.text-hidden').removeClass('text-hidden');

    hidden = false;
  } else {
    $('.eye > i')
      .removeClass('fa-eye')
      .addClass('fa-eye-slash');
    $('.input').addClass('text-hidden');
    hidden = true;
  }
});

$('#save-btn').click(function() {
  const inputs = $('.input').toArray();
  inputs.forEach(input => {
    const value = $(input).val();
    if (isValidDomain(value)) {
      dataSet.add(value);
    } else {
      console.log('not a valid domain');
    }
  });
  localStorage.setItem('noMoHistory', JSON.stringify([...dataSet.values()]));
});

$('#add-btn').click(function() {
  createInput();
});

function createInput(value = '') {
  domainSection.prepend(`
  <div class="row input-row">
    <label class="label" for="">Domain:</label>
    <input id="input-${numInputs}" class="${
    hidden ? 'text-hidden' : ''
  } input" placeholder="domain.com" value="${value}">
    <div class="trash">
      <i  id="trash-${numInputs}" class="fas fa-trash fa-lg delete"></i>
    </div>
  </div>
`);
  addDeleteListener(`#trash-${numInputs}`, `#input-${numInputs}`);
  numInputs++;
}

function deleteInput(value, inputId) {
  dataSet.delete(value);
  $(inputId)
    .closest('.input-row')
    .remove();
}

function addDeleteListener(trashId, inputId) {
  $(trashId).click(() => {
    const inputValue = $(inputId).val();
    deleteInput(inputValue, inputId);
  });
}

function isValidDomain(domain) {
  if (!domain) return false;
  var re = /^(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?$/gi;
  return re.test(domain);
}
