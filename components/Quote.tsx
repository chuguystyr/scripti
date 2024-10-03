const Quote = async () => {
  let quote
  try {
    const response = await fetch("https://api.quotable.io/random")
    quote = await response.json()
  } catch {
    quote = {
      content:
        "Live as if you were to die tomorrow. Learn as if you were to live forever.",
      author: "Mahatma Gandhi",
    }
  }
  return (
    <p
      className="card h-[15vh] md:w-[55%] overflow-clip hover:cursor-pointer overflow-y-auto"
      tabIndex={0}
    >
      {quote.content}{" "}
      <span className="block text-end font-semibold">{quote.author}</span>
    </p>
  )
}
export default Quote
