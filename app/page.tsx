import Alert from "@/components/alert";
import { MainForm } from "@/components/form/main-form";
import Providers from "@/hooks/provider";
import Badge from "@/components/badge";
import Background from "@/templates/background";
import Footer from "@/templates/footer";
import Nav from "@/templates/nav";

import FormJson from "@/utils/constants/new-project-scrum.json";
export default function Home() {
  return (
    <Background>
      <Nav />
      <Alert />
      <Providers>
        <MainForm
          message_button={'Enviar'}
          actionType={"add-project"}
          dataForm={FormJson}
        />
      </Providers>
      <Badge color="purple" text="Example" />
      <Footer />
    </Background>
  )
}

/* 

'use client'

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { AtSign, Phone, User, GraduationCap, Briefcase, Star } from 'lucide-react';
import { validateName, validatePhone, validateEmail, formatPhoneNumber } from '@/utils/functions/valid-inputs';

const CVForm: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validation checks
    if (name === 'name' && !validateName(value)) return;
    if (name === 'phone' && !validatePhone(value)) return;
    if (name === 'email' && !validateEmail(value)) return;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // File handling functions remain the same
  const handleFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>, type: 'profile' | 'documents') => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);

    if (type === 'profile' && files[0] && files[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else if (type === 'documents') {
      setDocuments(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'documents') => {
    const files = Array.from(event.target.files || []);

    if (type === 'profile' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else if (type === 'documents') {
      setDocuments(prev => [...prev, ...files]);
    }
  }, []);

  const preventDefault = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-6 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-8">
          <div className="max-w-md mx-auto">
            <form className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex flex-col">
                  <label className="leading-loose flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre completo
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Juan Pérez"
                      maxLength={50}
                    />
                    <span className="absolute right-2 top-2 text-xs text-gray-400">
                      {formData.name.length}/50
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose flex items-center gap-2">
                    <AtSign className="w-4 h-4" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="ejemplo@correo.com"
                    />
                    {formData.email && !formData.email.includes('@') && (
                      <span className="absolute right-2 top-2 text-xs text-red-500">
                        Falta @
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono
                  </label>
                  <div className="relative flex gap-2">
                    <select
                      name="countryCode"
                      className="px-2 py-2 border focus:ring-gray-500 focus:border-gray-900 sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      defaultValue="+1"
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+34">+34</option>
                      <option value="+52">+52</option>
                      <option value="+81">+81</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={formatPhoneNumber(formData.phone)}
                      onChange={handleInputChange}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="123-456-7890"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Foto de perfil</label>
                  <div
                    className="mt-1 flex justify-center items-center"
                    onDragOver={preventDefault}
                    onDrop={(e) => handleFileDrop(e, 'profile')}
                  >
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 border-dashed">
                      {profileImage ? (
                        <Image src={profileImage} alt="Profile" layout="fill" objectFit="cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <input
                      id="file-upload-profile"
                      name="file-upload-profile"
                      type="file"
                      className="sr-only"
                      onChange={(e) => handleFileInput(e, 'profile')}
                      accept="image/*"
                    />
                    <label
                      htmlFor="file-upload-profile"
                      className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      {profileImage ? 'Cambiar foto' : 'Subir foto'}
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Educación
                  </label>
                  <div className="relative">
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Educación"
                      rows={3}
                      maxLength={500}
                    />
                    <span className="absolute right-2 bottom-2 text-xs text-gray-400">
                      {formData.education.length}/500
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Experiencia laboral
                  </label>
                  <div className="relative">
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Experiencia laboral"
                      rows={3}
                      maxLength={1000}
                    />
                    <span className="absolute right-2 bottom-2 text-xs text-gray-400">
                      {formData.experience.length}/1000
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Habilidades
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      placeholder="Habilidades (separadas por comas)"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="leading-loose">Documentos adicionales</label>
                  <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                    onDragOver={preventDefault}
                    onDrop={(e) => handleFileDrop(e, 'documents')}
                  >
                    <div className="space-y-1 text-center">
                      {documents.length === 0 ? (
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <div className="text-sm text-gray-600">
                          {documents.map((file, index) => (
                            <p key={index} className="truncate">{file.name}</p>
                          ))}
                        </div>
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload-docs" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>{documents.length === 0 ? 'Subir archivos' : 'Cambiar archivos'}</span>
                          <input id="file-upload-docs" name="file-upload-docs" type="file" className="sr-only" onChange={(e) => handleFileInput(e, 'documents')} multiple />
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 flex items-center space-x-4">
                <button className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none hover:bg-blue-600 transition duration-300 ease-in-out">
                  Crear CV
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVForm;

*/
