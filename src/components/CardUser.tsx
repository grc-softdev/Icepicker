import Image from 'next/image'
import React from 'react'
import { CiBacon } from 'react-icons/ci'
import { FiMessageCircle } from 'react-icons/fi'

const CardUser = () => {
  return (
    <div
      className="border max-w-70 max-h-24 border-neutral-200 rounded-lg p-3 mb-2 gap-2 mr-6"
      
    >
      <div className="flex justify-between">
        <div className="flex items-center justify-start mb-4">
          <div>
            <Image
              src={'https://i.imgur.com/OZ1YruF.png'}
              width={40}
              height={40}
              alt="user"
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col ml-2">
            <h6 className="font-bold">Zé Lombriga</h6>

          </div>
        </div>
        <div className="flex items-start justify-center">
          <span
            className=" flex items-center bg-neutral-200 hover:bg-red-200 px-1.5 rounded-full text-sm"
          >
            x
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center">
          <CiBacon className="text-lg" />
          <span className="ml-1">host</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center ml-2">
            <FiMessageCircle />
            <span className="ml-1">2</span>
          </div>
        </div>
      </div>
    </div>
  )
}


export default CardUser