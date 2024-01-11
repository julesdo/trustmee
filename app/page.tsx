'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import celebreties from '../app/[people]/celebreties.json'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Home() {
  const router = useRouter()
  const [search, setSearch] = useState<any>('')
  const celebretiesArray = celebreties as any
  const [celebretiesImages, setCelebretiesImages] = useState<any>([])
  const placeholder = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'

  // ajoute une fonction qui va chercher les images des celebreties dans l'api /api/[name]

  useEffect(() => {
    const fetchData = async () => {
      const celebretiesImages = await Promise.all(celebretiesArray.map(async (celebretie: any) => {
        const res = await fetch(`/api/${celebretie.name}`)
        const data = await res.json()
        // Iterate over pages to find the first page with a thumbnail.source
        const pages = data.query.pages;
        const pagesArray = Object.values(pages);
        for (const page of pagesArray as any) {
          if (page.thumbnail && page.thumbnail.source) {
            const imageUrl = page.thumbnail.source;
            return { ...celebretie, image: imageUrl }
          }
        }
        return { ...celebretie, image: '' }
      }))
      setCelebretiesImages(celebretiesImages)
    }
    fetchData()
  }, [])


  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className='flex flex-wrap'>
        {celebretiesImages.map((celebretie: any) => {
          return (
            <TooltipProvider key={celebretie.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div onClick={() => router.push(`/${celebretie.name}`)} className='hover:border-2 hover:border-blue-500 hover:cursor-pointer border-2 border-white rounded-full'>
                    <img alt='' src={celebretie.image ? celebretie.image : placeholder} className='rounded-full h-4 w-4 object-cover transform-gpu' />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{celebretie.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
      <div className='flex flex-col gap-6 text-center h-screen justify-center items-center'>
        <h1 className='text-2xl font-bold'>
          TRUSTMEE
        </h1>
        <h2 className='text-lg font-semibold'>
          A simple way to search the best influencer for your project
        </h2>
        <Input onChange={(e) => setSearch(e.target.value)} className='rounded-full w-[60vw]' placeholder='Search an influencer as Dwayne Johnson' />
        <Button onClick={() => router.push(`/${search}`)} className='rounded-full w-fit'>Click here to search</Button>
        <p>{search}</p>
      </div>
    </main>
  )
}
