import Hero from '../components/Hero'
import HomeMidSection from '../components/HomeMidSection'
import LatestQueries from '../components/LatestQueries'

function Home() {
  return (
    <>
      <section>
        <Hero />
      </section>
      <section>
        <HomeMidSection />
        <LatestQueries />
      </section>
    </>
  )
}

export default Home
