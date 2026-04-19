import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layout/Layout'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
function App() {
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

               <Route path='*' element={<Navigate to="/" />} />
        </Routes>
       
  )
}

export default App
