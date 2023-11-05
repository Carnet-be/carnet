import { Button, Divider } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { type FullCar } from '~/types'
import { getCarImage, priceFormatter } from '~/utils/function'


const getPrice = (car: FullCar) => {
  if (car.type = "direct") {
    if (car.inRange && car.minPrice && car.maxPrice) {
      return priceFormatter.formatRange(car.minPrice, car.maxPrice)
    }
    if (car.price) {
      return priceFormatter.format(car.price)
    }
  } else {
    return priceFormatter.format(car.detail?.startingPrice ?? 0)
  }
}

const CarCard = ({ children: car }: { children: FullCar }) => {
  const primaryImage = getCarImage(car.images?.[0]?.key)

  return (
    <div className='rounded-xl bg-gray-50 overflow-hidden'>
      <div className='aspect-[5/3] relative'>
        <Image priority src={primaryImage} layout='fill' objectFit='cover' alt={car.name} />
      </div>
      <div className='p-3 space-y-1'>
        <div className='flex flex-row items-center gap-1 justify-between'>
          <span className='text-sm font-semibold text-black'>
            {car.name}
          </span>
        </div>
        <hr />
        <div className='flex flex-row items-start justify-between gap-1'>
          <span className='text-primary font-semibold'>
            {getPrice(car)}
          </span>
         <Link href={`/dashboard/car/${car.id}`}>
         <Button size='sm' color='primary' variant='flat'>Details</Button>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default CarCard