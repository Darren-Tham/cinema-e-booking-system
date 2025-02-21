"use client"

import MovieRatings from "@/components/option/MovieRatings"
import MovieStatuses from "@/components/option/MovieStatuses"
import useAdmin from "@/hooks/useAdmin"
import APIFacade from "@/lib/APIFacade"
import FormHandler from "@/lib/FormHandler"
import PageFacade from "@/lib/PageFacade"
import { Movie } from "@/lib/Types"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"

const titleCase = (s: string) =>
  s[0].toUpperCase() + s.substring(1).toLowerCase()

const EditMovie = () => {
  const searchParams = useSearchParams()
  const [form, setForm] = useState<Movie>({
    id: -1,
    title: "",
    trailerLink: "",
    imageLink: "",
    status: "",
    ratingOutOf10: "",
    categories: [],
    castMembers: [],
    directors: [],
    producers: [],
    synopsis: "",
    ratingCode: "",
    adultTicketPrice: 0,
    childTicketPrice: 0,
    seniorTicketPrice: 0
  })
  const [dateTimes, setDateTimes] = useState<string[]>([])
  const dateRef = useRef<HTMLInputElement>(null!)
  const timeRef = useRef<HTMLInputElement>(null!)
  const isAdmin = useAdmin()

  const labelStyles = "text-white font-semibold text-lg"
  const inputStyles = "rounded-sm outline-none p-2 text-sm w-[30rem]"
  const divStyles = "flex flex-col gap-1"

  useEffect(() => {
    const fetchMovie = async (movieId: number) => {
      const movie = await APIFacade.getMovieById(movieId)
      movie.ratingCode =
        movie.ratingCode === null ? "" : movie.ratingCode.replace("_", "-")
      movie.status = movie.status
        .split("_")
        .map(token => titleCase(token))
        .join(" ")
      setForm(movie)
    }

    const fetchShowTimesByMovieId = async (movieId: number) => {
      const showtimes = await APIFacade.getShowtimesByMovieId(movieId)
      const dateTimes = showtimes.map(({ dateTime }) => {
        const substrings = dateTime.split(" ")
        const date = substrings[0]
        const time = substrings[1]
        return `${date}T${time}`
      })
      dateTimes.sort((a, b) => a.localeCompare(b))
      setDateTimes(dateTimes)
    }

    const movieIdParam = searchParams.get("movieId")
    if (movieIdParam === null) {
      throw Error("movieId should not be null.")
    }

    const movieId = +movieIdParam
    if (isNaN(movieId)) {
      throw Error("movieId should be a valid number.")
    }

    fetchMovie(movieId)
    fetchShowTimesByMovieId(movieId)
  }, [])

  const arrayInputEmpty = (input: string[]) => {
    return input.length === 1 && input[0] === ""
  }

  const isValidForm = () => {
    if (form.title === "") {
      alert("Movie title cannot be empty.")
      return false
    }

    if (form.synopsis === "") {
      alert("Movie synopsis cannot be empty.")
      return false
    }

    if (form.imageLink === "") {
      alert("Movie image link cannot be empty.")
      return false
    }

    if (form.trailerLink === "") {
      alert("Movie trailer link cannot be empty.")
      return false
    }

    const ratingOutOf10 = +form.ratingOutOf10
    if (
      form.ratingOutOf10 === "" ||
      isNaN(ratingOutOf10) ||
      ratingOutOf10 < 0 ||
      ratingOutOf10 > 10
    ) {
      alert("Movie rating out of 10 must be between 0 and 10.")
      return false
    }

    if (form.ratingCode === "") {
      alert("Movie must have a rating code.")
      return false
    }

    if (form.status === "") {
      alert("Movie must have a status.")
      return false
    }

    if (arrayInputEmpty(form.categories)) {
      alert("Movie must have a category.")
      return false
    }

    if (arrayInputEmpty(form.directors)) {
      alert("Movie must have a director.")
      return false
    }

    if (arrayInputEmpty(form.producers)) {
      alert("Movie must have a producer.")
      return false
    }

    if (arrayInputEmpty(form.castMembers)) {
      alert("Movie must have a cast member.")
      return false
    }

    return true
  }

  const formToMovie = (): Movie => {
    return {
      ...form,
      ratingCode: form.ratingCode.replace("-", "_"),
      status: form.status.toUpperCase().replace(" ", "_"),
      categories: form.categories.map(category => titleCase(category))
    }
  }

  const formatDateTimes = (dateTimes: string[]) => {
    return dateTimes.map(dateTime => dateTime.replace("T", " "))
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidForm()) return
    await APIFacade.updateMovie(formToMovie())
    await APIFacade.updateMovieShowtimes(form.id, formatDateTimes(dateTimes))
    alert("Movie is successfully updated.")
    window.location.reload()
  }

  const handleAddShowTime = () => {
    const date = dateRef.current.value
    const time = timeRef.current.value
    if (date === "") {
      alert("Date cannot be empty.")
      return
    }

    if (time === "") {
      alert("Time cannot be empty.")
      return
    }

    const dateTime = `${date}T${time}:00`
    if (dateTimes.includes(dateTime)) {
      alert("Show time already exists.")
      return
    }
    setDateTimes(
      [...dateTimes, dateTime].toSorted((a, b) => a.localeCompare(b))
    )
  }

  return (
    isAdmin && (
      <div className="flex flex-col p-8 gap-10 justify-center items-center">
        <Link
          href={PageFacade.MANAGE_MOVIES}
          className="bg-jade px-4 py-2 text-white font-bold scale-transition rounded-md self-start"
        >
          Back To Manage Movies
        </Link>
        <form
          className="bg-dark-jade flex flex-col gap-4 p-4 rounded-md"
          onSubmit={handleFormSubmit}
        >
          <div className={divStyles}>
            <label htmlFor="title" className={labelStyles}>
              Title
            </label>
            <input
              id="title"
              className={inputStyles}
              value={form.title}
              onChange={e => FormHandler.updateForm(e, "title", form, setForm)}
            />
          </div>
          <div className={divStyles}>
            <label htmlFor="synopsis" className={labelStyles}>
              Synopsis
            </label>
            <textarea
              id="synopsis"
              className={inputStyles}
              value={form.synopsis}
              onChange={e =>
                FormHandler.updateForm(e, "synopsis", form, setForm)
              }
            />
          </div>
          <div className={divStyles}>
            <label htmlFor="image-link" className={labelStyles}>
              Image Link
            </label>
            <input
              id="image-link"
              className={inputStyles}
              value={form.imageLink}
              onChange={e =>
                FormHandler.updateForm(e, "imageLink", form, setForm)
              }
            />
          </div>
          <div className={divStyles}>
            <label htmlFor="trailer-link" className={labelStyles}>
              Trailer Link
            </label>
            <input
              id="trailer-link"
              className={inputStyles}
              value={form.trailerLink}
              onChange={e =>
                FormHandler.updateForm(e, "trailerLink", form, setForm)
              }
            />
          </div>
          <div className={divStyles}>
            <label htmlFor="rating-out-of-10" className={labelStyles}>
              Rating Out Of 10
            </label>
            <input
              id="rating-out-of-10"
              className={inputStyles}
              value={form.ratingOutOf10}
              onChange={e =>
                FormHandler.updateForm(e, "ratingOutOf10", form, setForm)
              }
            />
          </div>
          <div className={divStyles}>
            <label htmlFor="rating-code" className={labelStyles}>
              Rating Code
            </label>
            <select
              id="rating-code"
              className={inputStyles}
              value={form.ratingCode}
              onChange={e =>
                FormHandler.updateForm(e, "ratingCode", form, setForm)
              }
            >
              <MovieRatings />
            </select>
          </div>
          <div className={divStyles}>
            <label htmlFor="status" className={labelStyles}>
              Status
            </label>
            <select
              id="status"
              className={inputStyles}
              value={form.status}
              onChange={e => FormHandler.updateForm(e, "status", form, setForm)}
            >
              <MovieStatuses />
            </select>
          </div>
          <div className={divStyles}>
            <p className={labelStyles}>Categories</p>
            <input
              className={inputStyles}
              value={form.categories}
              onChange={e =>
                FormHandler.updateFormArray(e, "categories", form, setForm)
              }
            />
          </div>
          <div className={divStyles}>
            <p className={labelStyles}>Directors</p>
            <input
              className={inputStyles}
              value={form.directors}
              onChange={e =>
                FormHandler.updateFormArray(e, "directors", form, setForm)
              }
            />
          </div>
          <div className={divStyles}>
            <p className={labelStyles}>Producers</p>
            <textarea
              className={inputStyles}
              value={form.producers}
              onChange={e =>
                FormHandler.updateFormArray(e, "producers", form, setForm)
              }
            />
          </div>
          <div className={divStyles}>
            <p className={labelStyles}>Cast Members</p>
            <textarea
              className={inputStyles}
              value={form.castMembers}
              onChange={e =>
                FormHandler.updateFormArray(e, "castMembers", form, setForm)
              }
            />
          </div>
          <div className={divStyles}>
            <p className={labelStyles}>Adult Ticket Price</p>
            <input
              className={inputStyles}
              value={form.adultTicketPrice}
              onChange={e =>
                FormHandler.updateFormPrice(
                  e,
                  "adultTicketPrice",
                  form,
                  setForm
                )
              }
            />
          </div>
          <div className={divStyles}>
            <p className={labelStyles}>Child Ticket Price</p>
            <input
              className={inputStyles}
              value={form.childTicketPrice}
              onChange={e =>
                FormHandler.updateFormPrice(
                  e,
                  "childTicketPrice",
                  form,
                  setForm
                )
              }
            />
          </div>
          <div className={divStyles}>
            <p className={labelStyles}>Senior Ticket Price</p>
            <input
              className={inputStyles}
              value={form.seniorTicketPrice}
              onChange={e =>
                FormHandler.updateFormPrice(
                  e,
                  "seniorTicketPrice",
                  form,
                  setForm
                )
              }
            />
          </div>
          <div>
            <p className={labelStyles}>Schedule Movie</p>
            <div className="flex gap-3 justify-center">
              <input className="outline-none p-2" type="date" ref={dateRef} />
              <input className="outline-none p-2" type="time" ref={timeRef} />
              <button
                type="button"
                className="bg-jade text-white font-semibold px-4 py-2"
                onClick={handleAddShowTime}
              >
                Add
              </button>
            </div>
          </div>
          <div>
            <p className={labelStyles}>Scheduled Movies</p>
            <div className="flex flex-col gap-2">
              {dateTimes.map((dateTime, i) => (
                <div
                  key={dateTime}
                  className="grid"
                  style={{ gridTemplateColumns: "80% 20%" }}
                >
                  <div className="bg-light-jade text-white font-bold p-2">
                    {new Date(dateTime).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric"
                    })}
                  </div>
                  <button
                    type="button"
                    className="bg-red-500 text-white font-semibold"
                    onClick={() => {
                      const newShowTimeDateTimes = [...dateTimes]
                      newShowTimeDateTimes.splice(i, 1)
                      setDateTimes(newShowTimeDateTimes)
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="text-white bg-jade p-2 rounded-sm font-bold hover:scale-[1.015] transition-transform duration-300"
          >
            Apply Changes
          </button>
        </form>
      </div>
    )
  )
}

export default EditMovie
