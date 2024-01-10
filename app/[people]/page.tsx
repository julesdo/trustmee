'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {polarity} from 'polarity';

export default function Home({ params }: { params: { people: string } }) {

    const [data, setData] = useState([])
    const [wikidata, setWikidata] = useState([])
    const [profileImage, setProfileImage] = useState('')
    const name = params.people.replace('%20', ' ')
    const [sentiment, setSentiment] = useState() as any

    const fetchData = async () => {
        const search = params.people.replace('%20', ' ')
        const res = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=57f7fd2462f5423184a0102b3a533b50`)
        const wiki = await fetch(`https://en.wikipedia.org/w/rest.php/v1/page/${search}`)
        const wikidata = await wiki.json()
        setWikidata(wikidata)
        const data = await res.json()
        setData(data)
        const profileImage = await fetch(`/api/${search}`)
        const profileImageData = await profileImage.json()
        const pages = profileImageData.query.pages;

        // Utiliser Object.values() pour obtenir les valeurs de l'objet pages
        const pagesArray = Object.values(pages);

        // Itérer sur les pages pour trouver la première page avec un thumbnail.source
        for (const page of pagesArray as any) {
            if (page.thumbnail && page.thumbnail.source) {
                const imageUrl = page.thumbnail.source;
                setProfileImage(imageUrl)
                break; // Sortir de la boucle dès que la première image est trouvée
            }
        }
    }

    function tokenize(value: string) {
        const match = value.toLowerCase().match(/\S+/g)
        return match ? [...match] : []
      }

      const paragraphToWordArray = (paragraph: string) => {
        // Supprimer les caractères de ponctuation et diviser le paragraphe en mots
        const words = paragraph?.replace(/[.,\/#!$%\^&[[|\*;:{}=\-_`~()]/g, '').split(',');
    
        // séparer les mots par des virgules
        const filteredWords = words?.map((word) => word.trim());


      
        return filteredWords;
      }

    async function getSentiment() {
        const sentiment = polarity(wikidata)
        console.log(sentiment)
        setSentiment(sentiment)
    }

    useEffect(() => {
        fetchData()
        getSentiment()
        console.log(profileImage)
        console.log(wikidata)
    }, [params?.people])

    return (
        <main className="flex flex-col items-center justify-between">
            <div className='flex flex-col gap-6 text-center h-screen justify-center items-center p-40'>
                <img className="w-64 h-64 rounded object-cover" src={profileImage} alt="" />
                <h1 className='text-2xl font-bold'>
                    {params?.people ? name : 'Aucune personne trouvée'}
                </h1>
                <h2 className='text-lg font-semibold'>
                    {sentiment ? JSON.stringify(sentiment) : 'Aucun sentiment trouvé'}
                </h2>
                <span className="h-1/2 overflow-y-scroll w-screen">{JSON.stringify(data)}</span>
                <span className="h-1/2 overflow-y-scroll w-screen">{paragraphToWordArray(wikidata.source)}</span>
                <span className="h-1/2 overflow-y-scroll w-screen">{JSON.stringify(wikidata.source)}</span>
            </div>
        </main>
    )
}