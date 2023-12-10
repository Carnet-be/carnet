import { useUser } from "@clerk/nextjs"
import { ADMIN_ROLES, type AdminRole } from "~/utils/constants"

const useIsAdmin= () => {
    const {user}=useUser()
    const role=user?.publicMetadata?.role as (AdminRole | undefined)
    return role && ADMIN_ROLES.includes(role)
}

export default useIsAdmin