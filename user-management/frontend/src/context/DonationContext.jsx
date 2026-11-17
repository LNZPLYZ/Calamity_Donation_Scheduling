import { createContext, useReducer } from 'react'

// Share the donation list and its dispatcher with components throughout the app.
export const DonationContext = createContext(null)

// Apply named state changes so the list stays consistent after API requests.
const donationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DONATIONS':
      // Replace the initial list with the donations returned by the backend.
      return { donations: action.payload }
    case 'CREATE_DONATION':
      // Put a newly created donation first, matching the backend's newest-first list.
      return { donations: [action.payload, ...(state.donations ?? [])] }
    case 'DELETE_DONATION':
      // Remove only the donation whose ID matches the deleted API response.
      return {
        donations: (state.donations ?? []).filter(
          (donation) => donation._id !== action.payload._id,
        ),
      }
    default:
      return state
  }
}

// Wrap the app once so descendants can access donation state through the context.
export const DonationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(donationReducer, { donations: null })

  return (
    <DonationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </DonationContext.Provider>
  )
}
