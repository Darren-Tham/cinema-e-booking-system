"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getUser } from "@/lib/Auth"
import FirstNameInput from "./FirstNameInput"
import LastNameInput from "./LastNameInput"
import PhoneNumberInput from "./PhoneNumberInput"
import HomeAddressInput from "./home-address/HomeAddressInput"
import CardsInput from "./card/CardsInput"
import PasswordInput from "./PasswordInput"
import PromotionButton from "./PromotionButton"
import { useAuth } from "@/lib/useAuth"
import UnauthorizedScreen from "@/components/UnauthorizedScreen"
import { Customer } from "@/lib/Types"

const EditProfile = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [customer, setCustomer] = useState<Customer>()
  const isUser = useAuth("user")

  const boxStyles = "p-2 rounded-sm font-semibold"
  const jadeBoxStyles = `${boxStyles} bg-light-jade`

  useEffect(() => {
    async function initInfo() {
      const customer: Customer = (await getUser()).user
      setCustomer(customer)
    }

    initInfo()
  }, [])

  return isUser && customer !== undefined ? (
    <div className="flex flex-col bg-black h-screen items-center justify-center p-6">
      <div
        className={`flex flex-col bg-dark-jade items-center gap-10 rounded-lg p-8 overflow-auto ${
          dialogOpen ? "blur-md" : undefined
        }`}
      >
        <h1 className="text-white text-4xl font-semibold">Edit Profile</h1>
        <div className="flex">
          <div>
            <Image
              className="bg-white rounded-full"
              src="https://static.thenounproject.com/png/363633-200.png"
              alt="pfp"
              width={140}
              height={140}
              priority
            />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <div
              className="grid gap-x-6 gap-y-3"
              style={{ gridTemplateColumns: "repeat(3, auto)" }}
            >
              <FirstNameInput
                customer={customer}
                setDialogOpen={setDialogOpen}
              />
              <LastNameInput
                customer={customer}
                setDialogOpen={setDialogOpen}
              />
              <div className={jadeBoxStyles}>Email</div>
              <div className="p-2 rounded-sm font-semibold bg-emerald-50">
                {customer?.email}
              </div>
              <div />
              <PhoneNumberInput
                customer={customer}
                setDialogOpen={setDialogOpen}
              />
            </div>
            <PasswordInput customer={customer} setDialogOpen={setDialogOpen} />
          </div>
          <CardsInput customer={customer} setDialogOpen={setDialogOpen} />
          <HomeAddressInput customer={customer} setDialogOpen={setDialogOpen} />
        </div>
        <PromotionButton customer={customer} />
        <Link
          href="/"
          className={`${jadeBoxStyles} w-full hover:scale-[1.015] transition-transform duration-300 text-center`}
        >
          Back Home
        </Link>
      </div>
    </div>
  ) : (
    <UnauthorizedScreen />
  )
}

export default EditProfile
