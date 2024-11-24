/* "use client"

import { useState, useEffect } from "react";
import { RootState } from "@/actions/store";
import { useAppSelector } from "@/actions/selector";
//import { validateUserSession } from "@/services/validate-user-session";

import UserRoleRenderer from "@/templates/components/render-rol";
import { Button } from "@nextui-org/react";

const ParentComponent: React.FC = () => {
    const [role, setRole] = useState<string | null>(null);
    const [loadingRole, setLoadingRole] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    //const userState = useAppSelector((state: RootState) => state.authApi);

    const fetchUserRole = async () => {
        try {
            const userRole = await validateUserSession();
            if (userRole === "none") {
                setRole(null);
                setError(null);
            } else {
                setRole(userRole);
                setError(null);
            }
        } catch (error) {
            setRole(null);
            setError(error.message || "Error fetching user role");
        } finally {
            setLoadingRole(false);
        }
    };

    useEffect(() => {
        console.log(role);

        fetchUserRole();
    }, [role]); // Dependemos de 'userState' para hacer la llamada al backend

    return (
        <UserRoleRenderer
            user={<h1>User Content</h1>}
            admin={<h1>Admin Content</h1>}
            fallback={<Button color="primary">
                Button
            </Button>}
            role={role}
            loadingRole={loadingRole}
            error={error}
        />
    );
};

export default ParentComponent;

 */