import React from "react";
import { Spinner } from "@nextui-org/react";  // Importamos el loader de NextUI
import { UserRoleRendererProps } from "@/interfaces/render-page";


const UserRoleRenderer: React.FC<UserRoleRendererProps> = ({
    user,
    admin,
    fallback,
    role,
    loadingRole,
    error
}) => {
    if (loadingRole) {
        return (
            <>
                <Spinner size="lg" />{/* Loader de NextUI */}
            </>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Aquí se elige qué contenido renderizar en base al rol.
    if (role === "admin") {
        return <>{admin}</>;
    } else if (role === "user") {
        return <>{user}</>;
    } else {
        return <>{fallback}</>;
    }
};

export default UserRoleRenderer;
