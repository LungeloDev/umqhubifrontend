import { createContext, useContext } from "react"
const UserDataContext = createContext({})
export const useUserDataContext = () => useContext(UserDataContext)
export default UserDataContext