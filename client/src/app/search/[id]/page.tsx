import SuperheroesContainer from '@/components/SuperheroesContainer'

export const dynamic = 'force-dynamic'


interface SearchProps {
    params: { id: string }
    searchParams?: { [key: string]: string }
  }
  
  export default function Search({ params, searchParams }: SearchProps) {
    return (
        <div className="flex justify-center">
            <div>
                <p className="mt-6 text-center md:ml-40 md:text-start">
                    Results for: 
                    <b className="capitalize"> {decodeURI(params.id)}</b>
                </p>
                {/* Renderiza el componente SuperheroesContainer con el nombre y la casa como propiedades */}
                <SuperheroesContainer
                    name={decodeURI(params.id)}
                    house={searchParams?.house}
                />
            </div>
        </div>
    )
}
