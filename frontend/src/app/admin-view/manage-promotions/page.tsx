"use client"

import { FormEvent, useRef, useState } from "react"
import { useAuth } from "@/lib/useAuth"
import UnauthorizedScreen from "@/components/UnauthorizedScreen"
import { Email, Promotion } from "@/lib/Types"
import APIFacade from "@/lib/APIFacade"

const ManagePromotions = () => {
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const nameRef = useRef<HTMLInputElement>(null!)
  const discountCodeRef = useRef<HTMLInputElement>(null!)
  const startDateRef = useRef<HTMLInputElement>(null!)
  const endDateRef = useRef<HTMLInputElement>(null!)
  const isAdmin = useAuth("admin")

  const isValidForm = () => {
    if (nameRef.current.value === "") {
      alert("Name cannot be empty.")
      return false
    }

    if (discountCodeRef.current.value === "") {
      alert("Discount code cannot be empty.")
      return false
    }

    if (startDateRef.current.value === "") {
      alert("Start date cannot be empty.")
      return false
    }

    if (endDateRef.current.value === "") {
      alert("End date cannot be empty.")
      return false
    }

    if (
      new Date(endDateRef.current.value) <= new Date(startDateRef.current.value)
    ) {
      alert("End date must be after the start date.")
      return false
    }

    return true
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidForm()) return

    const promotion: Promotion = {
      name: nameRef.current.value,
      discountCode: discountCodeRef.current.value,
      discountPercentage,
      startDate: startDateRef.current.value,
      endDate: endDateRef.current.value
    }

    await APIFacade.addPromotion(promotion)
    const subscribedCustomersEmails =
      await APIFacade.getSubscribedCustomersEmails()
    for (const receiverEmail of subscribedCustomersEmails) {
      const email: Email = {
        receiverEmail,
        subject: `New Promotion: ${promotion.name}`,
        text: `Use the code ${promotion.discountCode} to get ${
          promotion.discountPercentage
        }% off! Promotion starts on ${formatDate(
          promotion.startDate
        )}, and it ends on ${formatDate(promotion.endDate)}.`
      }
      await APIFacade.sendEmail(email)
    }
  }

  return isAdmin ? (
    <div className="flex bg-black min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md bg-teal-950 p-4 rounded-md shadow-lg">
        <h1 className="text-white text-2xl font-bold mb-4 text-center">
          Promotions
        </h1>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-100 font-semibold">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 p-2 bg-bright-jade text-black rounded border border-gray-500 outline-none font-semibold"
              ref={nameRef}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="code" className="text-gray-100 font-semibold">
              Discount Code
            </label>
            <input
              id="code"
              type="text"
              className="mt-1 p-2 bg-bright-jade text-black rounded border border-gray-500 outline-none font-semibold"
              ref={discountCodeRef}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="discount" className="text-gray-100 font-semibold">
              Discount Percentage
            </label>
            <input
              id="discount"
              type="range"
              className="mt-1"
              value={discountPercentage}
              onChange={e => setDiscountPercentage(+e.target.value)}
              min="0"
              max="100"
            />
            <div className="flex justify-between text-white text-sm">
              <span className="font-semibold">0%</span>
              <span className="font-semibold">{discountPercentage}%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <label
                htmlFor="start-date"
                className="text-gray-100 font-semibold"
              >
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                className="w-full mt-1 p-2 bg-bright-jade text-black rounded border border-gray-500 outline-none font-semibold"
                ref={startDateRef}
              />
            </div>
            <div className="flex-1 min-w-0">
              <label htmlFor="end-date" className="text-gray-100 font-semibold">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                className="w-full mt-1 p-2 bg-bright-jade text-black rounded border border-gray-500 outline-none font-semibold"
                ref={endDateRef}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-light-jade text-white rounded hover:scale-[1.015] transition-transform duration-300 font-semibold"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  ) : (
    <UnauthorizedScreen />
  )
}

export default ManagePromotions
