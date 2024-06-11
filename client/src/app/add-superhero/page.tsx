'use client'
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { convertFilesToBase64 } from '@/services/utils'

interface SuperheroForm {
    name: string;
    real_name: string;
    home: string;
    age: string;
    biography: string;
    equipment: string;
    images: string[]; 
}
export default function AddSuperhero() {
    // Estado inicial del formulario del superhéroe
    const [superhero, setSuperhero] = useState<SuperheroForm>({
        name: '',
        real_name: '',
        home: '',
        age: '',
        biography: '',
        equipment: '',
        images: []
    });
    // Maneja los cambios en los inputs del formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSuperhero({
            ...superhero,
            [name]: value
        });
    };
    // Maneja los cambios en el input de imágenes
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            try {
                const base64Strings = await convertFilesToBase64(files);
                setSuperhero({ ...superhero, images: base64Strings });
            } catch (error) {
                console.error("Error reading images:", error);
                toast.error('Error reading images');
            }
        }
    };
    
    // Maneja el envío del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            console.log('super:', superhero);

            const response = await fetch('http://localhost:5000/superhero', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(superhero)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Superhero added:', data);
            toast.success('Superhero added successfully');
            setSuperhero({
                name: '',
                real_name: '',
                home: '',
                age: '',
                biography: '',
                equipment: '',
                images: []
            });
        } catch (error) {
            console.error('Error adding superhero:', error);
            toast.error('Error adding superhero');
        }
    };
    
    return (
        <div className="max-w-lg mx-auto my-4 p-6 bg-white rounded-md shadow-md">
            <h1 className="text-2xl font-bold mb-4">Add Superhero</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Name</label>
                    <input type="text" name="name" value={superhero.name} onChange={handleChange} required minLength={3} maxLength={50} pattern="[A-Za-z\s]+" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                    <p className="text-sm text-gray-500">Only letters and spaces, 3-50 characters.</p>
                </div>
                <div>
                    <label className="block mb-1">Real Name</label>
                    <input type="text" name="real_name" value={superhero.real_name} onChange={handleChange} minLength={3} maxLength={50} pattern="[A-Za-z\s]+" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                    <p className="text-sm text-gray-500">Only letters and spaces, 3-50 characters.</p>
                </div>
                <div>
                    <label className="block mb-1">Home</label>
                    <select name="home" value={superhero.home} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400">
                        <option value=""></option>
                        <option value="Marvel">Marvel</option>
                        <option value="DC">DC</option>
                    </select>
                    <p className="text-sm text-gray-500">Select Marvel or DC.</p>
                </div>
                <div>
                    <label className="block mb-1">Year appearance</label>
                    <input type="number" name="age" value={superhero.age} onChange={handleChange} required min={1900} max={2024} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                    <p className="text-sm text-gray-500">Enter a year between 1900 and 2024.</p>
                </div>
                <div>
                    <label className="block mb-1">Biography</label>
                    <textarea name="biography" value={superhero.biography} onChange={handleChange} required minLength={10} maxLength={500} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                    <p className="text-sm text-gray-500">10-500 characters.</p>
                </div>
                <div>
                    <label className="block mb-1">Equipment</label>
                    <input type="text" name="equipment" value={superhero.equipment} onChange={handleChange} minLength={5} maxLength={100} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                    <p className="text-sm text-gray-500">5-100 characters.</p>
                </div>
                <div>
                    <label className="block mb-1">Images</label>
                    <input type="file" name="images" onChange={handleImageChange} multiple required accept="image/png, image/jpeg" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                    <p className="text-sm text-gray-500">Accepts PNG and JPEG formats.</p>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Add Superhero</button>
            </form>
        </div>
    );
}
    