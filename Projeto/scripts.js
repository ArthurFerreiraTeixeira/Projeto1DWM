// Função para salvar usuários no localStorage
function saveUser(user) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

// Função para verificar login
function authenticateUser(username, password) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.username === username && user.password === password);
}

// Função para carregar o nome do usuário autenticado no dashboard
function loadUser() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('userDisplay').textContent = currentUser;
    }
}

// Função para salvar agendamentos no localStorage
function saveAppointment(appointment) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

// Função para carregar agendamentos do localStorage
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const currentUser = localStorage.getItem('currentUser');
    const appointmentsList = document.getElementById('appointmentsList');

    // Limpa a lista antes de adicionar novos itens
    appointmentsList.innerHTML = '';

    // Filtra os agendamentos pelo usuário logado
    const userAppointments = appointments.filter(app => app.username === currentUser);

    if (userAppointments.length > 0) {
        userAppointments.forEach(app => {
            const appointmentItem = document.createElement('p');
            appointmentItem.textContent = `Doação marcada para ${app.date} às ${app.time}`;
            appointmentsList.appendChild(appointmentItem);
        });
    } else {
        appointmentsList.textContent = 'Você não possui agendamentos ainda.';
    }
}

// Cadastro de novo usuário
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    saveUser({ username, email, password });
    alert('Usuário cadastrado com sucesso!');
    window.location.href = 'login.html';
});

// Login do usuário
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const user = authenticateUser(username, password);

    if (user) {
        localStorage.setItem('currentUser', username);
        // Redireciona diretamente para a página de agendamento após o login
        window.location.href = 'schedule.html';
    } else {
        alert('Usuário ou senha incorretos');
    }
});

// Agendamento de doação de sangue
document.getElementById('scheduleForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        saveAppointment({ username: currentUser, date, time });
        document.getElementById('confirmationMessage').textContent = `Doação marcada para ${date} às ${time}.`;
        document.getElementById('scheduleForm').reset(); // Limpa o formulário após o agendamento
    } else {
        alert('Você precisa estar logado para agendar uma doação.');
        window.location.href = 'login.html';
    }
});

// Exibir agendamentos na página de acompanhamento
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('appointmentsList')) {
        loadAppointments();
    }
});

// Exibir nome do usuário no dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('userDisplay')) {
        loadUser();
    }
});

// Logout do usuário
document.getElementById('logout')?.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});
