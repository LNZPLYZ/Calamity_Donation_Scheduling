import { useContext } from 'react'
import { DonationContext } from '../context/DonationContext.jsx'

// Provide a short, consistent way for components to read shared donation state.
export const useDonationContext = () => {
  const context = useContext(DonationContext)

  // Fail with a clear message if a component is rendered outside the provider.
  if (!context) {
    throw new Error(
      'useDonationContext must be used inside a DonationContextProvider',
    )
  }

  return context
}
