"use client";

import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
  Input,
  Button,
  Tabs,
  Tab,
  useDisclosure,
  Checkbox,
} from "@nextui-org/react";
import { Eye, EyeOff, LogIn, MailIcon } from "lucide-react";
import Link from "next/link";

const AuthModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState("login"); // Alternar entre login y registro
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Manejador de cambio de valores en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Enviar los datos de autenticación a la API
  const handleSubmit = async () => {
    setLoading(true);
    setError(""); // Limpiar error anterior
    try {
      const endpoint = `http://matrizmercadoliz.dyndns.org:29010/api/v1/users/${activeTab}`; // "login" o "register"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en la autenticación");
      }

      const data = await res.json();
      console.log("Autenticación exitosa:", data);
      onClose(); // Cerrar modal después del login/registro exitoso
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen} color="secondary">
        Iniciar Sesión <LogIn />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {activeTab === "login" ? "Iniciar Sesión" : "Registrarse"}
          </ModalHeader>
          <ModalBody>
            <Tabs selectedKey={activeTab} onSelectionChange={setActiveTab}>
              <Tab key="login" title="Iniciar Sesión" />
              <Tab key="register" title="Registro" />
            </Tabs>

            <div className="space-y-4 mt-4">
              <Input
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo Electrónico"
                fullWidth
              />
              <Input
                endContent={
                  <button
                    className="focus:outline-none flex gap-2"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {!isVisible ? (
                      <Eye
                        size={20}
                        absoluteStrokeWidth
                        className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                      />
                    ) : (
                      <EyeOff
                        size={20}
                        absoluteStrokeWidth
                        className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                      />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                fullWidth
              />
            </div>
            <div className="flex py-2 px-1 justify-between">
              <Checkbox
                classNames={{
                  label: "text-small",
                }}
              >
                Remember me
              </Checkbox>
              <Link color="primary" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              onClick={handleSubmit}
              color="secondary"
              isLoading={loading}
            >
              {activeTab === "login" ? "Iniciar Sesión" : "Registrarse"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AuthModal;
