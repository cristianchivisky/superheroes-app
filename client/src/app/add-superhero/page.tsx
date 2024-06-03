'use client'
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface SuperheroForm {
    name: string;
    real_name: string;
    home: string;
    age: string;
    biography: string;
    equipment: string;
    image: File | null; 
}
export default function AddSuperhero() {
    const [superhero, setSuperhero] = useState<SuperheroForm>({
        name: '',
        real_name: '',
        home: '',
        age: '',
        biography: '',
        equipment: '',
        image: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSuperhero({
            ...superhero,
            [name]: value
        });
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSuperhero({
            ...superhero,
            [name]: value
        });
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSuperhero({
            ...superhero,
            image: file
        });
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', superhero.name);
        formData.append('real_name', superhero.real_name);
        formData.append('home', superhero.home);
        formData.append('age', superhero.age);
        formData.append('biography', superhero.biography);
        formData.append('equipment', superhero.equipment);
        if (superhero.image) {
            formData.append('image', superhero.image);
        }


        try {
            const response = await fetch('http://localhost:5000/superhero', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Superhero added:', data);
            toast.success('Superhero added successfully');
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
                    <input type="text" name="name" value={superhero.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                    <label className="block mb-1">Real Name</label>
                    <input type="text" name="real_name" value={superhero.real_name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                    <label className="block mb-1">Home</label>
                    <input type="text" name="home" value={superhero.home} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                    <label className="block mb-1">Year appearance</label>
                    <input type="text" name="age" value={superhero.age} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                    <label className="block mb-1">Biography</label>
                    <textarea name="biography" value={superhero.biography} onChange={handleTextareaChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                    <label className="block mb-1">Equipment</label>
                    <input type="text" name="equipment" value={superhero.equipment} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                    <label className="block mb-1">Image</label>
                    <input type="file" name="image" onChange={handleImageChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Add Superhero</button>
            </form>
        </div>
    );
}
    