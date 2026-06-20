import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import SearchBar from '../components/SearchBar'

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen ">
      
      <Header />
      <Hero />
  <div className='container mx-auto'>
    <SearchBar/>
  </div>
    
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        {children}
      </main>

      <Footer />

    </div>
  )
}

export default Layout