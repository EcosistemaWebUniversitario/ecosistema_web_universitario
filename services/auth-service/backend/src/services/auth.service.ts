import { supabaseAdmin, supabaseAuth } from '../config/supabase';

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  account_type: 'estudiante' | 'empresa';
}

interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const { email, password, full_name, account_type } = data;

  if (!email || !password || !full_name || !account_type) {
    throw new Error('Missing required fields');
  }

  if (!['estudiante', 'empresa'].includes(account_type)) {
    throw new Error('Invalid account type');
  }

  const { data: userData, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name,
      account_type
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return userData;
};

export const loginUser = async (data: LoginData) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const { data: sessionData, error } = await supabaseAuth.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = sessionData.user;

  if (!user) {
    throw new Error('User not found after login');
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    user,
    session: sessionData.session,
    profile
  };


};

export const logoutUser = async () => {
  return {
    message: 'Logout successful'
  };
};