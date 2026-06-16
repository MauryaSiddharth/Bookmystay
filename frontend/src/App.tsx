import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layout/Layout'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import AddHotel from './pages/AddHotel'
import { useAppContext } from './contexts/AppContext'
import MyHotels from './pages/MyHotels'
import EditHotel from './pages/EditHotel'
function App() {
  // 
  const {isLoggedIn} = useAppContext();
  return (
      
        <Routes>
           <Route path='/' element={<Layout>
            <p>Home page</p>
           </Layout>} />
             <Route path='/search' element={<Layout>
            <p>Search page</p>
           </Layout>} />
              
              <Route path='/register' element={
                <Layout>
                  <Register/>
                </Layout>
              } />

              <Route path="/sign-in" element={
                <Layout>
                  <SignIn/>
              </Layout>} />


              {/*  write logic for admin only  */}
              {isLoggedIn && <>
                 <Route path='/add-hotel'  element={
                  <Layout>
                    <AddHotel/>
                  </Layout>
                 } />

                   <Route path='/my-hotels'  element={
                  <Layout>
                    <MyHotels/>
                  </Layout>
                 } />

                  <Route path='/edit-hotel/:hotelId'  element={
                  <Layout>
                    <EditHotel/>
                  </Layout>
                  
                 } />





              </> }

               <Route path='*' element={<Navigate to="/" />} />
        </Routes>
       
  )
}

export default App
