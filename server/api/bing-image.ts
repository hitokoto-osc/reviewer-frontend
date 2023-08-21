export default defineEventHandler(async (event) => {
  const res = await fetch(
    'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=20&mkt=en-US'
  )
  if (res.body == null) {
    return new Response('Not found', { status: 404 })
  }
  return sendStream(event, res.body)
})
