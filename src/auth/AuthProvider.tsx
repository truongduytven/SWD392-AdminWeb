// src/auth/AuthProvider.tsx
import axios from 'axios'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import busAPI from '@/lib/busAPI'
import { toast } from 'sonner'
// Define the shape of our AuthContext
interface AuthContextType {
  token: string | null
  user: User | null,
  userDetail:IUserDetail|null,
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  errorMessage: string | null
  loading: boolean
}

// Define the shape of User
interface User {
  userID: string
  userName: string
  password: string
  fullName: string
  email: string
  avatar: string
  address: string
  otpCode: string
  phoneNumber: string
  balance: number
  createDate: string
  isVerified: boolean
  status: string
  roleID: string
  result: any
}
interface IUserDetail {
  UserID: string
  UserName: string
  Password: string
  FullName: string
  Email: string
  Avatar: string
  Address: string
  OtpCode: string
  PhoneNumber: string
  Balance: number
  CreateDate: string
  IsVerified: boolean
  Status: string
  RoleID: string
  RoleName: string
  CompanyID: string
}
// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Define the AuthProvider component
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })
  const [user, setUser] = useState<User | null>(null)
  const [userDetail, setUserDetail] = useState<IUserDetail | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await busAPI.get<User>('/auth-management/managed-auths/token-verification', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setUser(response.data.result.user)
        } catch (error) {
          localStorage.removeItem('token')
          localStorage.removeItem('token')
          console.error('Fetching user information failed:', error)
        }
      }
    }
    fetchUser()
  }, [token])

  // const login = async (username: string, password: string) => {
  //   try {
  //     const response = await busAPI.post('/auth/login', { email: username, password: password })
  //     console.log('red', response)
  //     const newToken = response.data.result.accessToken
  //     setToken(newToken)
  //     localStorage.setItem('token', newToken)
  //     // Redirect to home or another route after successful login
  //     navigate(-1)
  //   } catch (error) {
  //     console.error('Login failed:', error)
  //   }
  // }

  // const login = async (username: string, password: string) => {
  //   try {
  //     const response = await busAPI.post('/auth/login', { email: username, password: password })
  //     console.log('red', response)
  //     const newToken = response.data.result.accessToken
  //     setToken(newToken)
  //     localStorage.setItem('token', newToken)
  //     setErrorMessage(null)
  //     navigate(-1)
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       const message = error.response.data.result.message
  //       setErrorMessage(message)
  //       toast.error(message)
  //     } else {
  //       console.error('Login failed:', error)
  //     }
  //   }
  // }
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await busAPI.post('/auth-management/managed-auths/sign-ins', {
        email: email,
        password: password
      })
      const newToken = response.data.AccessToken
      setToken(newToken)
      localStorage.setItem('token', newToken)
      setErrorMessage(null)
      // toast.success('Đăng nhập thành công')
      // navigate(-1)
      // Fetch user data after setting the token
      const fetchUser = async () => {
        try {
          const response = await busAPI.get<User>('/auth-management/managed-auths/token-verification', {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          })
          const userData = response.data.result.user
          setUser(userData)
          const respons = await busAPI.get<IUserDetail>(`/user-management/managed-users/${user?.userID}/details`)
          setUserDetail(respons.data)
          if (respons.data.RoleName === 'Manager' || respons.data.RoleName === 'Admin') {
            toast.success('Đăng nhập thành công')
            navigate('/home')
          } else {
            toast.error('Tài khoản không được phép đăng nhập vào hệ thống')
            localStorage.removeItem('token')

            // const response = await busAPI.post('user-management/managed-users/otp-code-sending', user?.email)
            // navigate(`/otp-verified/${user?.email}`); // Navigate to the verification page
          }
        } catch (error) {
          console.error('Fetching user information failed:', error)
        }
      }

      fetchUser()
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error)
        const message = error.response.data.message
        console.log('msajgjgaej', message)
        if (error.response.data.verified === false) {
          toast.error('Email đã đăng kí nhưng chưa xác thực. Vui lòng xác thực email!')
          navigate(`/otp-verified/${email}`)
          const response = await busAPI.post('user-management/managed-users/otp-code-sending', { email: email })
        } else {
          setLoading(false)
          toast.error('Email hoặc mật khẩu không đúng')
        }
        console.log('check verified', error.response.data.verified)
        setErrorMessage(message)
      } else {
        console.error('Login failed:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    toast.success('Đăng xuất thành công')

    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    toast.success('Đăng xuất tài khoản thành công')
    // Redirect to login page after logout
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ token, user,userDetail, login, logout, errorMessage, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
