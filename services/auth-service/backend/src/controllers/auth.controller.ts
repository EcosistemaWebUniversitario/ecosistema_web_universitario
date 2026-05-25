import { Request, Response } from 'express';
import { registerUser, loginUser, logoutUser } from '../services/auth.service';
import { supabaseAdmin } from '../config/supabase';
import { getPermissionsByRole } from '../config/permissions';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      ok: true,
      message: 'User registered successfully',
      user
    });
  } catch (error: any) {
    console.error('REGISTER ERROR:', error);
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      ok: true,
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    console.error('LOGIN ERROR:', error);
    return res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized'
      });
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      return res.status(404).json({
        ok: false,
        message: 'Profile not found'
      });
    }

    return res.status(200).json({
      ok: true,
      user,
      profile
    });
  } catch (error: any) {
    console.error('ME ERROR:', error);
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    const result = await logoutUser();

    return res.status(200).json({
      ok: true,
      message: result.message
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};

export const myPermissions = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: 'Unauthorized'
      });
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({
        ok: false,
        message: 'Profile not found'
      });
    }

    const { data: role, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('name')
      .eq('id', profile.role_id)
      .single();

    if (roleError || !role) {
      return res.status(404).json({
        ok: false,
        message: 'Role not found'
      });
    }

    const permissions = getPermissionsByRole(role.name);

    return res.status(200).json({
      ok: true,
      role: role.name,
      permissions
    });
  } catch (error: any) {
    console.error('PERMISSIONS ERROR:', error);
    return res.status(500).json({
      ok: false,
      message: error.message || 'Internal server error'
    });
  }
};