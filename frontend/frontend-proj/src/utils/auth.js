export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/user';

export function saveToken(token){
  localStorage.setItem('token', token);
}

export function getToken(){
  return localStorage.getItem('token');
}

export function isAuthenticated(){
  return true; // !!getToken();
}

export function logout(){
  localStorage.removeItem('token');
}
