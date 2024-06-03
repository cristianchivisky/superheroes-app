import SuperheroesContainer from '@/components/SuperheroesContainer'

export const dynamic = 'force-dynamic'

export default function Search({
    params,
    searchParams,
}: {
    params: { id: string }
    searchParams?: { [key: string]: string }
}) {
    return (
        <div className="flex justify-center">
            <div>
                <p className="mt-6 text-center md:ml-40 md:text-start">
                    Results for: 
                    <b className="capitalize"> {decodeURI(params.id)}</b>
                </p>
                <SuperheroesContainer
                    name={decodeURI(params.id)}
                    house={searchParams?.house}
                />
            </div>
        </div>
    )
}
