import { getEndpointsURL } from "./utils.js";

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

const API_URL = getEndpointsURL()

if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const requestData = {
            username: email,
            password: password
        };

        try {
            const response = await fetch(`${API_URL}?action=login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login successful!');
                localStorage.setItem("username", email)
                window.location.href = "index.html";
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Login request failed:', error);
            alert('Failed to connect to the server.');
        }
    };
}

if (registerForm) {
    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const requestData = {
            username: email,
            password: password
        };

        try {
            const response = await fetch(`${API_URL}?action=register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful!');
                localStorage.setItem("username", email)
                window.location.href = "index.html";
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Registration request failed:', error);
            alert('Failed to connect to the server.');
        }
    };
}