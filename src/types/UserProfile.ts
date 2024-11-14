import RoleEnum from 'src/enums/RoleEnum'

interface UserProfile {
  id: number
  email: string
  fullName: string
  role: RoleEnum
}
export default UserProfile
