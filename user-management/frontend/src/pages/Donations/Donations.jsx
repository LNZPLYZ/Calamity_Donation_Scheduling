import { useEffect } from 'react'
import { useDonationContext } from '../../hooks/useDonationContext.js'

// Components
import DonationDetails from './DonationDetails.jsx'
import DonationForm from './DonationForm.jsx'
 
const Donations = () => {
  // Read the shared list and dispatch function supplied by DonationContextProvider.
  const { donations, dispatch } = useDonationContext()


  useEffect(() => {
    // Load the current list once when this page first appears.
    const fetchDonations = async () => {
      // Vite forwards this same-origin path to the Express API during development.
      const response = await fetch('/api/donations')
      const json = await response.json()

      if (response.ok) {
       // Store the returned array so React renders one card per donation.
       dispatch({ type: 'SET_DONATIONS', payload: json })
      }
    }
    
    // Run the request without blocking the initial page render.
    fetchDonations()
  }, [])

  return (
    <main className="home">
      <div className="donations">
        {/* The backend returns an array; each card receives one donation object. */}
        {donations && donations.map((donation) => (
            <DonationDetails key={donation._id} donation={donation} />
        ))}
      </div>
      <DonationForm />
    </main>
  )
}

export default Donations
