import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    // Fetch admin user by email
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !adminUser) {
      return null
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash)
    
    if (!isValidPassword) {
      return null
    }

    // Update last login timestamp
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminUser.id)

    // Return admin user without password hash
    const { password_hash, ...adminWithoutPassword } = adminUser
    return adminWithoutPassword as AdminUser
  } catch (error) {
    console.error('Admin authentication error:', error)
    return null
  }
}

export async function createAdmin(
  email: string, 
  password: string, 
  name: string, 
  role: string = 'admin'
): Promise<AdminUser | null> {
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        role,
        is_active: true
      })
      .select('id, email, name, role, is_active, created_at, updated_at')
      .single()

    if (error) {
      console.error('Error creating admin:', error)
      return null
    }

    return newAdmin as AdminUser
  } catch (error) {
    console.error('Admin creation error:', error)
    return null
  }
}

export async function getAllAdmins(): Promise<AdminUser[]> {
  try {
    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active, last_login_at, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching admins:', error)
      return []
    }

    return admins as AdminUser[]
  } catch (error) {
    console.error('Admin fetch error:', error)
    return []
  }
}

export async function deactivateAdmin(adminId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: false })
      .eq('id', adminId)

    if (error) {
      console.error('Error deactivating admin:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Admin deactivation error:', error)
    return false
  }
}