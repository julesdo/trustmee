'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter()
  const [search, setSearch] = useState<any>('')
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className='flex flex-col gap-6 text-center h-screen justify-center items-center'>
        <h1 className='text-2xl font-bold'>
          TRUSTMEE
        </h1>
        <h2 className='text-lg font-semibold'>
          A simple way to search the best influencer for your project
        </h2>
        <Input onChange={(e)=> setSearch(e.target.value)} className='rounded-full w-[60vw]' placeholder='Search an influencer as Dwayne Johnson' />
        <Button onClick={()=> router.push(`/${search}`)} className='rounded-full w-fit'>Click here to search</Button>
        <p>{search}</p>
      </div>
    </main>
  )
}
