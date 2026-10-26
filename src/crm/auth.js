// Acceso al espacio privado con Supabase Auth usando nombre de usuario.
// Supabase exige un correo, así que el usuario se traduce a uno técnico interno que nunca recibe mensajes.
import { supabase } from './supabase';

const EMAIL_DOMAIN = 'jc-crm.local';
const normalizeUsername = (username) => String(username || '').trim().toLowerCase();
const toEmail = (username) => `${normalizeUsername(username)}@${EMAIL_DOMAIN}`;

export const usernameOf = (user) => user?.user_metadata?.username || user?.email?.split('@')[0] || '';

const translate = (message = '') => {
  if (/invalid login credentials/i.test(message)) return 'Usuario o contraseña incorrectos.';
  if (/rate limit|too many/i.test(message)) return 'Demasiados intentos. Espera un momento y vuelve a intentar.';
  if (/password should be at least/i.test(message)) return 'La contraseña debe tener al menos 8 caracteres.';
  if (/failed to fetch|network/i.test(message)) return 'Sin conexión con el servidor. Revisa tu internet.';
  return message || 'Ocurrió un error inesperado.';
};

export const getSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const adminExists = async () => {
  const { data, error } = await supabase.rpc('crm_admin_exists');
  if (error) throw new Error(translate(error.message));
  return !!data;
};

export const signIn = async (username, password) => {
  if (!normalizeUsername(username)) throw new Error('Escribe tu usuario.');
  const { data, error } = await supabase.auth.signInWithPassword({ email: toEmail(username), password });
  if (error) throw new Error(translate(error.message));
  return data.session;
};

// Primer acceso: crea la cuenta del administrador con el código de instalación y entra.
export const createAdmin = async (code, username, password) => {
  const { error } = await supabase.rpc('crm_create_admin', { p_code: code, p_username: username, p_password: password });
  if (error) throw new Error(translate(error.message));
  return signIn(username, password);
};

export const signOut = () => supabase.auth.signOut();

export const updatePassword = async (password) => {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw new Error(translate(error.message));
};

export const onAuthChange = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));
  return () => data.subscription.unsubscribe();
};
