import Link from 'next/link';
import React from 'react';

interface SuperheroCardProps {
    superhero: {
        _id: string;
        name: string;
        real_name: string;
        biography: string;
        image: string;
    };
}

export default function SuperheroCard ({ superhero }: SuperheroCardProps) {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <Link href={`/superhero/${superhero._id}`}>
                <img className="w-full bg-white" src={`data:image/png;base64,${superhero.image}`} alt={`${superhero.name} image`} />
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">
                        {superhero.name}
                    </div>
                    <div className="font-bold text-md mb-2">
                        {superhero.real_name}
                    </div>
                    <p className="text-gray-700 text-base">
                        {superhero.biography.substring(0, 35)}...
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <button type="button" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                        See more
                    </button>
                </div>
            </Link>
        </div>
    );
}

