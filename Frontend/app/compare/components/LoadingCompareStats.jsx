import React from 'react'
import Animate from '@/app/loading/components/Animate'
import Skeleton from '@/app/loading/components/Skeleton'
import { TextSkeleton } from '@/app/loading/components/TextSkeleton'

const LoadingCompareStats = () => {
  return (
    <Animate key={1}>
      <div className=" flex justify-between items-stretch md:h-[800px] gap-4">
        <div className="w-full flex flex-col justify-between">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <TextSkeleton />
          <TextSkeleton />
        </div>
      </div>
    </Animate>
  )
}

export default LoadingCompareStats