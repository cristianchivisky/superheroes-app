'use client'
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ClipLoader } from 'react-spinners'; 

interface Superhero {
    _id: string;
    name: string;
    real_name: string;
    age: string;
    home: string;
    biography: string;
    equipment: string;
    image: string;
}
interface SuperheroProps {
    params: {
        id: string;
    };
}
  
export default function Superhero ({ params }: SuperheroProps) {
    const { id } = params;
    const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Superhero>>({});

    useEffect(() => {
        async function fetchSuperheroes() {
            try {
                const response = await fetch('http://localhost:5000/superheroes');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Superhero[] = await response.json();
                setSuperheroes(data);
            } catch (error: Error | any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
        
        fetchSuperheroes();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="sweet-loading">
                    <ClipLoader loading={loading} size={70}/>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="flex justify-center  items-center min-h-screen">Error: {error}</div>;
    }
    const superhero: Superhero | undefined = superheroes.find(s => s._id === id);
    if (!superhero) {
        return <div>Superhero not found</div>;
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdate = async () => {
        try {
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
                <div className="h-80 lg:h-96 lg:w-96 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white" style={{ backgroundImage: `url('data:image/png;base64,${superhero.image}')` }} title={superhero.name}>
                </div>
                <div className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b-lg lg:rounded-b-none lg:rounded-r-lg  p-4 lg:rounded-l-lg flex flex-col justify-between leading-normal w-full">
                    <div className="max-w-lg mx-auto my-4 p-6 bg-white rounded-md shadow-md w-full">
                        <div className="mb-8">
                            <form className="space-y-4">
                                <div>
                                    <label className="block mb-1">Name</label>
                                    <input type="text" name="name" value={formData.name || superhero.name} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block mb-1">Real Name</label>
                                    <input type="text" name="real_name" value={formData.real_name || superhero.real_name} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block mb-1">Home</label>
                                    <div className="flex items-center mb-4">
                                        <img className="w-10 h-10 mr-1" src={`/logos/logo_${superhero.home}.png`} alt={superhero.home} />
                                        <input type="text" name="home" value={formData.home || superhero.home} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Year appearance</label>
                                    <input type="text" name="age" value={formData.age || superhero.age} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block mb-1">Biography</label>
                                    <textarea name="biography" value={formData.biography || superhero.biography} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
                                </div>
                                <div>
                                    <label className="block mb-1">Equipment</label>
                                    <input type="text" name="equipment" value={formData.equipment || superhero.equipment} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-400" />
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