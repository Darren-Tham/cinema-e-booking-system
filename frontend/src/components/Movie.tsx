import Image from "next/image"
import PlayCircle from "@public/play-circle-icon.svg"
import Link from "next/link"
import { Movie } from "@/lib/Types"
import PageFacade from "@/lib/PageFacade"

type Props = {
  movie: Movie
  handleTrailerClick: () => void
}

export default function MovieComponent({
  movie,
  handleTrailerClick
}: Readonly<Props>) {
  return (
    <div className="bg-jade p-2 flex flex-col justify-end">
      <div className="relative">
        <button className="absolute left-1 top-1" onClick={handleTrailerClick}>
          <Image src={PlayCircle} alt="Play Circle" />
        </button>
        <Link href={PageFacade.movieShowtime(movie.id)}>
          <Image
            src={movie.imageLink}
            alt={movie.title}
            width={175}
            height={0}
            priority
          />
        </Link>
      </div>
      <h2 className="text-emerald-100 font-smibold text-center mt-1">
        {movie.title}
      </h2>
    </div>
  )
}
