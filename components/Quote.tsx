const Quote = async () => {
  const response = await fetch("https://api.quotable.io/random")
  const quote = await response.json()
  return (
    <p className="card h-[15vh] md:w-[55%] overflow-clip hover:cursor-pointer overflow-y-auto">
      {quote.content}{" "}
      <span className="block text-end font-semibold">{quote.author}</span>
    </p>
  )
}
export default Quote
