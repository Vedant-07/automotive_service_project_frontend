import React from 'react'
import Hero from '../../components/Hero'
import Services from '../../components/Services'

const LandingPage = () => {
  return (
    <>
    <main className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <Hero />
        <Services />
        
      </main>
    </>
  )
}

export default LandingPage