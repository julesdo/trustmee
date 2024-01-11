'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { get } from "http";
import Sentiment from 'sentiment'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import celebreties from './celebreties.json'
import { useRouter } from "next/navigation";

export default function Home({ params }: { params: { people: string } }) {

    const [data, setData] = useState([])
    const [wikidata, setWikidata] = useState([])
    const [profileImage, setProfileImage] = useState('')
    const name = params.people.replace('%20', ' ')
    const [sentiment, setSentiment] = useState() as any
    const [loading, setLoading] = useState(false)
    const celebretiesArray = celebreties as any
    const router = useRouter()

    const fetchData = async () => {
        try {
          setLoading(true);
          const search = params.people.replace('%20', ' ');
    
          // Fetch news data
          const res = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=57f7fd2462f5423184a0102b3a533b50`);
          const data = await res.json();
          setData(data);
    
          // Fetch Wikipedia data
          const wiki = await fetch(`https://en.wikipedia.org/w/rest.php/v1/page/${search}`);
          const wikidata = await wiki.json();
          setWikidata(wikidata);
    
          // Fetch profile image data
          const profileImage = await fetch(`/api/${search}`);
          const profileImageData = await profileImage.json();
          const pages = profileImageData.query.pages;
    
          // Iterate over pages to find the first page with a thumbnail.source
          const pagesArray = Object.values(pages);
          for (const page of pagesArray as any) {
            if (page.thumbnail && page.thumbnail.source) {
              const imageUrl = page.thumbnail.source;
              setProfileImage(imageUrl);
              break;
            }
          }
    
          const sentiment = new Sentiment();
          const test = concatenerArticles(data)
          if (test) {
            const result = sentiment.analyze(test)
            setSentiment(result)
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);

          // kill the sentiment analysis
        const sentiment = new Sentiment();
        }
      };

    function concatenerArticles(data: any[]) {
        let articles = ''
        {/*@ts-ignore */}
        data?.articles?.map((article: { description: string; }) => {
            articles += article.description + ' '
        })
        return articles
    }

    function pushToRandomCelebreties() {
        // nombre aléatoire entre 0 et la taille du tableau
        const randomCelebreties = Math.floor(Math.random() * celebretiesArray.length)
        router.push(`/${celebretiesArray[randomCelebreties].name}`)
    }

    useEffect(() => {
        fetchData()
    }, [params?.people])

    return (
        <main className="flex flex-col items-center justify-between">
            <div className='flex flex-col gap-6 text-center justify-center items-center p-8'>
                {profileImage ? <img alt="" className='rounded-full w-40 h-40 object-cover' src={profileImage} /> : <div className='rounded-full w-40 h-40 bg-gray-300'></div>}
                <h1 className='text-2xl font-bold'>
                    {params?.people ? name : 'Aucune personne trouvée'}
                </h1>
                <h2 className='text-lg font-semibold'>
                    {sentiment ? JSON.stringify(sentiment.comparative * 1000) : 'Aucun sentiment trouvé'}
                </h2>
                <div>
                    { sentiment && sentiment.comparative * 1000 > 20 ? <p className="text-green-800">Trust</p> : <p className="text-red-800">Dont trust</p>}
                </div>
                <div className="flex gap-2">
                    <Button variant={'secondary'} onClick={()=> router.push(`/`)} className='rounded-full w-fit'>Accueil</Button>
                <Button onClick={()=> pushToRandomCelebreties()} className='rounded-full w-fit'>Aleatoire</Button>
                </div>
            </div>
            <div className="flex flex-col gap-6 p-8 h-full">
                <h2 className="text-2xl font-bold">Articles</h2>
                <div className="h-[50vh] overflow-y-scroll grid md:grid-cols-3 gap-2">
                    {/*@ts-ignore */}
                {data?.articles?.map((article: { title: string; description: string; url: string; }) => {
                    return (
                        <Card key={article.title}>
                            <CardHeader>
                            <CardTitle>{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                            <p>{article.description}</p>
                            </CardContent>
                            <CardFooter>
                            <Button onClick={()=> window.open(article.url, '_blank')}>Read more</Button>
                            </CardFooter>
                        </Card>
                    )
                })}
                </div>
            </div>
        </main>
    )
}