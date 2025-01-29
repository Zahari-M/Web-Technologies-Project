import { getEndpointsURL } from "./utils.js";

export const logout = async () => {
    try {
        const response = await fetch(`${getEndpointsURL()}?action=logout`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.removeItem("username")
            alert('Logged out successfully!');
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Logout request failed:', error);
        alert('Failed to connect to the server.');
    }
};