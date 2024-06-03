import SuperheroesContainer from '@/components/SuperheroesContainer'

export const dynamic = 'force-dynamic'

export default function Home({ searchParams }: { searchParams?: { [key: string]: string } }) {
    
    return (
        <main>
            <div className="flex justify-center ">
                <SuperheroesContainer house={searchParams?.house}/>
            </div>
        </main>
    )
}
