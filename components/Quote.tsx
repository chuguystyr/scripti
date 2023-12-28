const Quote = async () => {
  const response = await fetch("https://api.quotable.io/random");
  const quote = await response.json();
  return (
    <div className="card h-[15vh] md:w-[55%] overflow-clip hover:h-fit hover:cursor-pointer">
      <p id="quote">
        {quote.content}{" "}
        <span className="block text-end font-semibold">{quote.author}</span>
      </p>
    </div>
  );
};
export default Quote;
