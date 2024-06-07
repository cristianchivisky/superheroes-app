'use client'
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { convertFilesToBase64 } from '@/services/utils';

interface Superhero {
    _id: string;
    name: string;
    real_name: string;
    age: string;
    home: string;
    biography: string;
    equipment: string;
    images: string[];
}
interface SuperheroProps {
    params: {
        id: string;
    };
}
  
export default function Superhero ({ params }: SuperheroProps) {
    const { id } = params; // ID del superhéroe de los parámetros de la URL
    const [superhero, setSuperhero] = useState<Superhero | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Superhero>>({});
    // Fetch para obtener los datos del superhéroe
    useEffect(() => {
        async function fetchSuperheroes() {
            try {
                const response = await fetch('http://localhost:5000/superheroes');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const superhero = data.find((s: Superhero) => s._id === id);
                if (!superhero) {
                    throw new Error('Superhero not found');
                }
                setSuperhero(superhero);
                setFormData({
                    name: superhero.name,
                    real_name: superhero.real_name,
                    age: superhero.age,
                    home: superhero.home,
                    biography: superhero.biography,
                    equipment: superhero.equipment,
                    images: superhero.images
                });
            } catch (error: Error | any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        
        fetchSuperheroes();
    }, [id]);
    // Muestra un spinner de carga mientras se obtienen los datos
    if (loading) {
        return <LoadingSpinner loading={loading} />;
    }
    // Muestra un mensaje de error si ocurre un error
    if (error) {
        return <ErrorMessage error={error} />;
    }
    // Maneja los cambios en los inputs del formulario de edición
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    // Maneja la eliminación de una imagen
    const handleRemoveImage = (index: number) => {
        const updatedImages = [...(formData.images || [])];
        updatedImages.splice(index, 1);
        setFormData({
            ...formData,
            images: updatedImages
        });
    };
    // Maneja la adición de nuevas imágenes
    const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            try {
                const base64Strings = await convertFilesToBase64(files);
                setFormData({
                    ...formData,
                    images: formData.images ? [...formData.images, ...base64Strings] : base64Strings
                });
            } catch (error) {
                console.error("Error reading images:", error);
                toast.error('Error reading images');
            }
        }
    };
    // Maneja la actualización de los datos del superhéroe
    const handleUpdate = async () => {
        try {
            console.log(formData)
            const response = await fetch(`http://localhost:5000/superhero/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update superhero');
            }

            toast.success('Superhero updated successfully!');
        } catch (error: any) {
            setError(error.message);
            toast.error('Error updating superhero');
        }
    };
    // Maneja la eliminación del superhéroe
    const handleDelete = async () => {
        toast(
            (t) => (
                <div>
                    <p>Are you sure you want to delete this superhero?</p>
                    <div>
                        <button
                            onClick={async () => {
                                try {
                                    const response = await fetch(`http://localhost:5000/superhero/${id}`, {
                                        method: 'DELETE'
                                    });
                        
                                    if (!response.ok) {
                                        throw new Error('Failed to delete superhero');
                                    }
                        
                                    toast.success('Superhero deleted successfully!', { duration: 5000 });
                                    window.location.href = "/";
                                } catch (error: any) {
                                    setError(error.message);
                                    toast.error('Error deleting superhero');
                                }
                                toast.dismiss(t.id);
                            }}
                            className="mr-2 text-red-500 font-bold py-2 px-4 rounded"
                        >
                            Confirm
                        </button>
                        <button onClick={() => toast.dismiss(t.id)} className='mr-2 text-gray-500 font-bold py-2 px-4 rounded'>Cancel</button>
                    </div>
                </div>
            ),

        );
        
    };
    return (
        <div className="flex justify-center">
            <div className="max-w-sm w-full lg:max-w-4xl lg:flex justify-center my-5">
                <div className="h-80 lg:h-96 lg:w-96 flex-none bg-cover rounded-t-lg lg:rounded-lg text-center overflow-hidden border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white" >
                    <Carousel showThumbs={false} showStatus={false} infiniteLoop autoPlay>
                        {formData.images && formData.images.map((img, index) => (
                            <div key={index}>
                                <img src={`data:image/jpeg;base64,${img}`} alt={`Superhero Image ${index}`} className="rounded-t-lg lg:rounded-lg" />
                                {(formData.images ?? []).length > 1 && (
                                    <button onClick={() => handleRemoveImage(index)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">Remove</button>
                                )}
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b-lg lg:rounded-b-none lg:rounded-r-lg  p-4 lg:rounded-l-lg flex flex-col justify-between leading-normal w-full">
                    <div className="max-w-lg mx-auto my-4 p-6 bg-white rounded-md shadow-md w-full">
                        <div className="mb-8">
                            <form className="space-y-4">
                                <div>
                                    <label className="block mb-1">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required minLength={3} maxLength={50} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block mb-1">Real Name</label>
                                    <input type="text" name="real_name" value={formData.real_name} onChange={handleInputChange} required minLength={3} maxLength={50} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block mb-1">Home</label>
                                    <div className="flex items-center mb-4">
                                        <img className="w-10 h-10 mr-1" src={`/logos/logo_${formData.home}.png`} alt={formData.home} />
                                        <select name="home" value={formData.home} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400">
                                            <option value="Marvel">Marvel</option>
                                            <option value="DC">DC</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Year appearance</label>
                                    <input type="text" name="age" value={formData.age} onChange={handleInputChange} required min={1900} max={2024} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block mb-1">Biography</label>
                                    <textarea name="biography" value={formData.biography} onChange={handleInputChange} required minLength={50} maxLength={500} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400 resize-none"/>
                                </div>
                                <div>
                                    <label className="block mb-1">Equipment</label>
                                    <input type="text" name="equipment" value={formData.equipment} onChange={handleInputChange} required minLength={5} maxLength={100} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block mb-1">Add New Image</label>
                                    <input type="file" accept="image/png, image/jpeg" onChange={handleAddImage} multiple className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <button type="button" onClick={handleUpdate} className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600">Update</button>
                                <button type="button" onClick={handleDelete} className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">Delete</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};