import React from 'react'
import CardUser from './CardUser'

const Users = () => {
  return (
    <div className='min-w-[300px] ml-4'>
      <div className='overflow-y-auto'>
        <CardUser/>
        <CardUser/> 
        <CardUser/> 
        <CardUser/>
        <CardUser/>
        <CardUser/>
      </div>
      <div className='flex items-center justify-between h-12 '>
        <input placeholder=' message' className='border border-solid rounded-sm'/>
        <div className='mr-12 border border-solid px-3'>send</div>
      </div>
      </div>
  )
}

export default Users