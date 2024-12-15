"use client";
import React, { useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { LogIn, UserRoundPlus } from "lucide-react";
import Providers from "@/hooks/providers";
import { MainForm } from "@/components/utils/main-form";
import RegisterFormJson from "@/constants/register-form.json";
import LoginFormJson from "@/constants/login-form.json";

// Tipos para las props y estado
type ActiveTab = "login" | "register" | "none";

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("none");

  const getFormJson = () => {
    switch (activeTab) {
      case "register":
        return RegisterFormJson;
      case "login":
        return LoginFormJson;
      default:
        throw new Error(`Unknown form type: ${activeTab}`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 ">
      <Providers>
        <div className="w-full max-w-md  p-6 rounded-lg shadow-md flex flex-col gap-4 bg-white">
          <Tabs
            aria-label="Options"
            key="login"
            onSelectionChange={(key: any) => setActiveTab(key as ActiveTab)}
            variant="solid"
          >
            <Tab
              key="login"
              title={
                <div className="flex items-center space-x-2">
                  <LogIn />
                  <span>Iniciar sesión</span>
                </div>
              }
            />
            <Tab
              key="register"
              title={
                <div className="flex items-center space-x-2">
                  <UserRoundPlus />
                  <span>Registrar</span>
                </div>
              }
            />
          </Tabs>
          {activeTab !== "none" && (
            <MainForm
              message_button={activeTab === "login" ? "Iniciar sesión" : "Registrar"}
              actionType={activeTab}
              dataForm={getFormJson()}
            />
          )}
        </div>
      </Providers>
    </div>
  );
};

export default LoginPage;
