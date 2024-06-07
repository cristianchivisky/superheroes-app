import SuperheroesContainer from '@/components/SuperheroesContainer'

export const dynamic = 'force-dynamic'

interface HomeProps {
    searchParams?: { [key: string]: string };
  }
  
export default function Home({ searchParams }: HomeProps) {
    
    return (
        <main>
            <div className="flex justify-center ">
                {/* Muestra el contenedor de superhéroes, filtrado por la casa si se proporciona */}
                <SuperheroesContainer house={searchParams?.house}/>
            </div>
        </main>
    )
}
