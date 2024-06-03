'use client'
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners'; 
import SuperheroCard from './SuperheroCard'


export default function SuperheroesContainer({ name, house }: {name?: string, house: string | undefined}) {
    const [superheroes, setSuperheroes] = useState<any[]>([]);
    const [filteredSuperheroes, setFilteredSuperheroes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchSuperheroes() {
            try {
                const url = house ? `http://localhost:5000/${house}` : 'http://localhost:5000/superheroes';
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                  setSuperheroes(data);
                  setFilteredSuperheroes(data); 
                } else {
                  throw new Error('Data is not an array');
                }
            } catch (error: any) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSuperheroes();
    }, [house]);

    useEffect(() => {
        if (name) {
            const filterResults = superheroes.filter(superhero =>
                superhero.name.toLowerCase().includes(name.toLowerCase())
            );
            setFilteredSuperheroes(filterResults);
        } else {
            setFilteredSuperheroes(superheroes);
        }
    }, [name, superheroes]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="sweet-loading">
                    <ClipLoader loading={loading} size={50} />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen">Error: {error.message}</div>;
    }
    return (
        <div className="mb-12 mt-8 flex max-w-[1500px] flex-col gap-4 mx-auto">

            <div className="grid gap-8 px-2 md:px-24 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSuperheroes.map(superhero => (
                            <SuperheroCard
                                superhero={superhero}
                                key={superhero._id}
                            />
                    ))}
            </div>
        </div>
    )
}
