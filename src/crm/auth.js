// Acceso al espacio privado con Supabase Auth (correo + contraseña).
import { supabase } from './supabase';

const translate = (message = '') => {
  if (/invalid login credentials/i.test(message)) return 'Correo o contraseña incorrectos.';
  if (/email not confirmed/i.test(message)) return 'Debes confirmar tu correo antes de entrar.';
  if (/rate limit|too many/i.test(message)) return 'Demasiados intentos. Espera un momento y vuelve a intentar.';
  if (/password should be at least/i.test(message)) return 'La contraseña debe tener al menos 6 caracteres.';
  if (/failed to fetch|network/i.test(message)) return 'Sin conexión con el servidor. Revisa tu internet.';
  return message || 'Ocurrió un error inesperado.';
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error(translate(error.message));
  return data.session;
};

export const signOut = () => supabase.auth.signOut();

export const sendPasswordReset = async (email) => {
  // El enlace del correo vuelve a la web; App.vue detecta el evento PASSWORD_RECOVERY.
  const redirectTo = `${window.location.origin}/`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  if (error) throw new Error(translate(error.message));
};

export const updatePassword = async (password) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(translate(error.message));
};

export const onAuthChange = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));
  return () => data.subscription.unsubscribe();
};
