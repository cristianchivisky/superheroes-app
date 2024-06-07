import SuperheroesContainer from '@/components/SuperheroesContainer'

export const dynamic = 'force-dynamic'

interface HouseProps {
    params: { id: string }
  }
  
  export default function House({ params }: HouseProps) {
    return (
        <div className="flex justify-center">
            {/* Renderiza el componente SuperheroesContainer con la casa como propiedad */}
            <SuperheroesContainer house={decodeURI(params.id)} />
        </div>
    );
}