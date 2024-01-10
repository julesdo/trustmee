export async function GET(
    request: Request,
    { params }: { params: { name: string } }
  ) {
    const name = params.name
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${name}&prop=pageimages&format=json&pithumbsize=1000`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }
    )
    const data = await response.json()
    return Response.json(data)
  }