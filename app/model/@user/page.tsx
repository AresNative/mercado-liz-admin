'use client'
import { useState } from 'react';

export default function Postulaciones() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!file) {
            setMessage('Por favor, selecciona un archivo.');
            return;
        }

        // Crear el objeto FormData
        const formData = new FormData();

        // Agregar el archivo
        formData.append('File', file); // Asegúrate de que el nombre coincida con lo que espera el backend

        // Agregar los datos de postulación como un objeto JSON
        const postulacionData: any = {
            name: "Combo Familiar",
            price: "299.9",
            price_ofer: "249.9",
            description: "test",
            date: "2025-02-01",
            state: "Disponible",
            porcentaje: "16"
        }/* {
            nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            edad: ,
            fecha_nacimiento: '1993-01-01',
            correo_electronico: 'juan.perez@example.com',
            numero_telefono: '1234567890',
            direccion_actual: 'Calle Falsa 123',
            fecha_radica_ciudad: '2010-01-01',
            medio_transporte: 'Automóvil',
            tiempo_traslado: '30 minutos',
            estado_civil: 'Soltero',
            tiempo_casado: '',
            bienes_mancomunados: '',
            tienes_hijos: 'No',
            planeas_mas_hijos: 'No',
            disponibilidad_horario: 'SI',
            ultimo_grado_estudios: 'Licenciatura',
            tienes_certificado: 'Sí',
            estudias_actualmente: 'No',
            dias_horario_estudio: '',
            ultimo_lugar_trabajo: 'Empresa XYZ',
            puesto_ultimo_trabajo: 'Desarrollador',
            tiempo_trabajo: '3 años',
            salario_semanal: '10000',
            horario_trabajo: '9am - 6pm',
            dia_descanso: 'Domingo',
            motivo_salida: 'Búsqueda de nuevas oportunidades',
            penultimo_lugar_trabajo: '',
            puesto_penultimo_trabajo: '',
            tiempo_penultimo_trabajo: '',
            salario_semanal_penultimo: '',
            horario_penultimo_trabajo: '',
            dia_descanso_penultimo: '',
            motivo_salida_penultimo: '',
            como_se_entero_vacante: 'Internet',
            conoce_trabajador: 'No',
            a_quien_conoce: '',
            tipo_relacion: '',
            sucursal: 'Sucursal Central',
            vacante: 'Desarrollador Full Stack',
        } */;

        // Agregar los datos de postulación como un campo en el FormData
        formData.append('CombosData', JSON.stringify(postulacionData));

        try {
            const response = await fetch('http://localhost:5077/api/v2/insert/combos', {
                method: 'POST',
                body: formData, // No necesitas agregar headers para FormData
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Postulación enviada correctamente.');
            } else {
                setMessage('Error al enviar la postulación.');
            }
            console.log(result);
        } catch (error) {
            setMessage('Error al conectar con el servidor.');
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Subir Archivo y Enviar Datos de Prueba</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '10px' }}>
                        Selecciona un archivo:
                    </label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Enviar Datos de Prueba
                </button>
            </form>
            {message && <p style={{ marginTop: '20px', color: '#0070f3' }}>{message}</p>}
        </div>
    );
}