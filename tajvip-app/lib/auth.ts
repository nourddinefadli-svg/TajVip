const SESSION_KEY = 'tajvip_auth';

export function isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function login(password: string): boolean {
    const expected = process.env.NEXT_PUBLIC_APP_PASSWORD || 'lumiere2025';
    if (password === expected) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        return true;
    }
    return false;
}

export function logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
}
