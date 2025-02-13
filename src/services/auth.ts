import axios from 'axios';

const apiUrl = 'http://localhost:3000';

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/users/register`, { username, email, password });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error || 'Ошибка при регистрации пользователя');
    }
    throw new Error('Ошибка при регистрации пользователя');
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/users/login`, { email, password });
    localStorage.setItem("userId", response.data.userId);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error || 'Ошибка при входе в систему');
    }
    throw new Error('Ошибка при входе в систему');
  }
};

export const sendResetLink = async (email: string) => {
  try {
    await axios.post(`${apiUrl}/users/reset-password`, { email });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error || 'Ошибка при отправке ссылки для сброса пароля');
    }
    throw new Error('Ошибка при отправке ссылки для сброса пароля');
  }
};

export const checkIfLoggedIn = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return false;
  }

  try {
    const response = await axios.get(`${apiUrl}/users/check-user`, {
      headers: {
        'User-Id': userId // Send user ID in headers
      }
    });
    return response.data.exists;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // User not found
      console.warn('Пользователь не найден в базе данных.');
      return false;
    }
    console.error('Ошибка при проверке пользователя в базе данных:', err);
    return false;
  }
};

export const checkIfLoggedInKick = async () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    handleLogout();
    return false;
  }

  try {
    const response = await axios.get(`${apiUrl}/users/check-user`, {
      headers: {
        'User-Id': userId // Send user ID in headers
      }
    });
    return response.data.exists;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      // User not found
      console.warn('Пользователь не найден в базе данных.');
      handleLogout();
      return false;
    }
    console.error('Ошибка при проверке пользователя в базе данных:', err);
    handleLogout();
    return false;
  }
};

export const handleLogout = () => {
  const userId = localStorage.getItem("userId");

  // Check if userId exists before attempting to log out
  if (!userId) {
    console.warn("Пользователь не авторизован.");
    window.location.href = "/";
    return;
  }

  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  window.location.href = "/";
};

export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    // Fetch the current user ID from your authentication endpoint
    const response = await fetch('/api/auth/current-user');
    if (response.ok) {
      const data = await response.json();
      return data.userId;
    }
    return null;
  } catch (error) {
    console.error('Ошибка при получении текущего пользователя', error);
    return null;
  }
};