document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
    setupEventListeners();
    setRandomEventPlaceholder();
});

function initializeForm() {
    const eventDateInput = document.getElementById('eventDate');
    eventDateInput.min = getTodayDateFormatted();

    populateParticipants();
}

function getTodayDateFormatted() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function populateParticipants() {
    const participantsSelect = document.getElementById('participants');
    for (let i = 1; i <= 100; i++) {
        participantsSelect.options.add(new Option(i, i));
    }
}

function setupEventListeners() {
    const form = document.getElementById('reservationForm');
    form.addEventListener('submit', handleFormSubmit);

    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', enforceNumericInput);
}

function enforceNumericInput(event) {
    event.target.value = event.target.value.replace(/\D/g, '');
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;

    if (form.checkValidity()) {
        alert('Cadastro realizado com sucesso!');
        form.reset();
    } else {
        alert('Por favor, preencha todos os campos corretamente.');
    }
}

async function buscarCep() {
    const cep = document.getElementById('cep').value;
    if (cep.length !== 8) {
        return alert("CEP deve ter 8 dígitos.");
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error('Resposta da rede não foi ok.');

        const data = await response.json();
        if (data.erro) throw new Error('CEP não encontrado.');

        preencherCampos(data);
    } catch (error) {
        alert(error.message);
    }
}

function preencherCampos(data) {
    document.getElementById('eventAddress').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('cidade').value = data.localidade || '';
    document.getElementById('estado').value = data.uf || '';

    clearCustomValidity(['eventAddress', 'bairro', 'cidade', 'estado']);
}

function clearCustomValidity(fieldIds) {
    fieldIds.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.setCustomValidity('');
    });

    // Call reportValidity to update the form's visual state
    document.getElementById('reservationForm').reportValidity();
}

function setRandomEventPlaceholder() {
    const eventPlaceholders = [
        "Aniversário de 15 anos da Jennifer",
        "Casamento da Ana e do Carlos",
        "Conferência de Desenvolvimento Sustentável",
        "Show de Talentos da Escola",
        "Feira de Artesanato do Bairro"
    ];
    const randomIndex = Math.floor(Math.random() * eventPlaceholders.length);
    const eventNameInput = document.getElementById('eventName');
    eventNameInput.placeholder = eventPlaceholders[randomIndex];
}