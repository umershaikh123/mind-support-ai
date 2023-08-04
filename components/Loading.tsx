import { LoadingText1 } from "./LoadingText"

import anime from "animejs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRef } from "react"

export const LoadingScreen = () => {
  const Ref = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      const ref = Ref.current

      anime({
        targets: ref,

        opacity: [0, 1],
        easing: "easeInOutSine",
        duration: 1200,
      })
    }, 2200)
  }, [])

  return (
    <div className="h-[90vh] flex-col flex  mx-auto w-auto justify-center items-center relative">
      <div className=" flex flex-row">
        {/* <div ref={Ref} className="absolute top-[43%] left-[16%] opacity-0"> */}
        <div ref={Ref} className="mt-4 mr-6 opacity-0">
          <Image src={"/Images/Brain.svg"} width={80} height={80} alt="logo" />
        </div>
        <div className=" ">
          <LoadingText1 />
        </div>
      </div>
    </div>
  )
}
