'use client'
import { useEffect, useState } from 'react';
import SuperheroCard from './SuperheroCard'
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';


interface Superhero {
    _id: string;
    name: string;
    real_name: string;
    biography: string;
    images: string[];
  }
  
  interface SuperheroesContainerProps {
    name?: string;
    house: string | undefined;
  }
export default function SuperheroesContainer({ name, house }: SuperheroesContainerProps) {
    const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
    const [filteredSuperheroes, setFilteredSuperheroes] = useState<Superhero[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // useEffect para obtener la lista de superhéroes desde la API
    useEffect(() => {
        async function fetchSuperheroes() {
            try {
                const url = house ? `http://localhost:5000/${house}` : 'http://localhost:5000/superheroes';
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Superhero[] = await response.json();
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
    
    // useEffect para filtrar los superhéroes basado en el nombre
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
    
    // Función para hacer scroll hasta el inicio de la página
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Muestra un spinner de carga si los datos están siendo cargados
    if (loading) {
        return <LoadingSpinner loading={loading} />;
    }
    // Muestra un mensaje de error si ocurre un problema al obtener los datos
    if (error) {
        return <ErrorMessage error={error} />;
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
            <div>
                <button onClick={scrollToTop} className="fixed bottom-12 right-4 p-4 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
