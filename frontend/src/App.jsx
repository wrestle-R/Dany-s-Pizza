import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CustomerLoginPage  from './components/CustomerLogin'
import CustomerRegisterPage from './components/CustomerRegister'
import OwnerLoginPage  from './components/OwnerLogin'
import OwnerRegisterPage from './components/OwnerRegister'
import OwnerHero from './components/owner/OwnerHero'
import OwnerMenu from '../src/components/owner/OwnerMenu'
import CustomerMenu from './components/customer/Menu'
import OwnerChef from '../src/components/owner/OwnerChef'
import Chef from './components/customer/Chef'
import axios from 'axios';
import {Toaster} from 'react-hot-toast'
import {CustomerProvider} from '../context/customerContext'
import {OwnerProvider} from '../context/ownerContext'
import Hero from './components/Hero'
import ReviewForm from './components/customer/Reviews'
import OwnerReview from './components/owner/OwnerReviews'

import Dashboard from './components/customer/Dashboard'

axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

const App = () => {
  return (
    <>
    <OwnerProvider>
      
   
      <CustomerProvider>
        <BrowserRouter>
          <Navbar/>
            <Toaster position='bottom-right' toastOptions={{duration : 3000} }/>
              <Routes>
                <Route path='/login' element={<CustomerLoginPage/>}/>
                <Route path='/register' element={<CustomerRegisterPage/>}/>
                <Route path='/owner-login' element={<OwnerLoginPage/>}/>
                <Route path='/owner-register' element={<OwnerRegisterPage/>}/>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/owner-hero' element={<OwnerHero/>}/>
                <Route path='/owner-menu' element={<OwnerMenu/>}/>
                <Route path='/menu' element={<CustomerMenu/>}/>
                <Route path='/owner-chef' element={<OwnerChef/>}/>
                <Route path='/chefs' element={<Chef/>}/>
                <Route path='/' element={<Hero/>}/>
                <Route path='/reviews' element={<ReviewForm/>}/>
                <Route path='/owner-reviews' element={<OwnerReview/>}/>





              </Routes>
        </BrowserRouter>
      </CustomerProvider>
      
    </OwnerProvider>  
      
    </>
  )
}

export default App