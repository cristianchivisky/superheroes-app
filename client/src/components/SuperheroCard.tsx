import Link from 'next/link';
import React from 'react';

interface SuperheroCardProps {
    superhero: {
        _id: string;
        name: string;
        real_name: string;
        biography: string;
        images: string[];
    };
}

export default function SuperheroCard ({ superhero }: SuperheroCardProps) {
    const image = superhero.images.length > 0 ? superhero.images[0] : '';
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <Link href={`/superhero/${superhero._id}`}>
            {image ? (
                    <img className="w-full bg-white" src={`data:image/png;base64,${image}`} alt={`${superhero.name} image`} />
                ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                    </div>
                )}
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

