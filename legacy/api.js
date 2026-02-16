const API_BASE = '/api';

export const api = {
    login: async (email, pin) => {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pin })
        });
        return response.json();
    },

    changePin: async (newPin) => {
        const response = await fetch(`${API_BASE}/auth/change-pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPin })
        });
        return response.json();
    },

    getStats: async () => {
        const response = await fetch(`${API_BASE}/stats`);
        return response.json();
    },

    getCharts: async () => {
        const response = await fetch(`${API_BASE}/stats/charts`);
        return response.json();
    },

    getUsers: async () => {
        const response = await fetch(`${API_BASE}/users`);
        return response.json();
    },

    getTiers: async () => {
        const response = await fetch(`${API_BASE}/tiers`);
        return response.json();
    },

    getActivity: async () => {
        const response = await fetch(`${API_BASE}/activity`);
        return response.json();
    },

    generateImage: async (prompt) => {
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        return response.json();
    }
};
