import SuperheroesContainer from '@/components/SuperheroesContainer'

export const dynamic = 'force-dynamic'

export default function House({
    params,
    
}: {
    params: { id: string }
}) {
    return (
        <div className="flex justify-center">
            <SuperheroesContainer house={decodeURI(params.id)} />
        </div>
    );
}