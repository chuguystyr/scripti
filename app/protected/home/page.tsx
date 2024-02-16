import Schedule from "components/Schedule";
import Tasks from "components/Tasks";
import Quote from "components/Quote";
import Name from "components/Name";
import DateTime from "components/DateTime";
const Home: React.FC<{
  searchParams?: { [key: string]: string | string[] | undefined };
}> = async ({searchParams}) => {
  return (
    <main className="flex flex-col md:flex-row gap-5 md:gap-10">
      <section id="left" className="md:w-1/2">
        <section
          className="flex flex-col md:flex-row justify-between"
          id="greeting"
        >
          <div className="card h-[15vh] w-fit">
            <Name />
            <DateTime />
          </div>
          <Quote />
        </section>
        <section className="card mt-10 md:w-[44.7vw]" id="schedule">
          <Schedule />
        </section>
      </section>
      <Tasks searchParams={searchParams}/>
    </main>
  );
};
export default Home;
