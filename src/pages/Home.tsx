import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-600">
            Creative & Printing Services
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Bringing your ideas to life through design and print.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            From professional graphic design and photo printing to custom
            clothing, banners, and jerseys, KRISANTUS COLLECTION helps you
            turn your ideas into something you can see and touch.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/services"
              className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Explore Services
            </Link>

            <Link
              to="/contact"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home