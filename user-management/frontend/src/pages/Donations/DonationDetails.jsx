import { useState } from 'react'
import { useDonationContext } from '../../hooks/useDonationContext.js'


const DonationDetails = ({ donation }) => {
    // Use shared state to remove the card after the backend confirms deletion.
    const { dispatch } = useDonationContext()
    const [deleteError, setDeleteError] = useState('')

// Ask the backend to delete this donation before removing it from the visible list.
const handleClick = async () => {
    setDeleteError('')

    try {
        // The donation ID is part of the URL; DELETE is handled by the matching API route.
        const response = await fetch(`/api/donations/${donation._id}`, {
            method: 'DELETE',
        })
        const json = await response.json()

        if (!response.ok) {
            throw new Error(json.error || 'Could not delete donation')
        }

        // Update the UI only after a successful server response.
        dispatch({ type: 'DELETE_DONATION', payload: json })
    } catch (error) {
        // Keep the card visible and show the backend's reason if deletion fails.
        setDeleteError(
            error instanceof Error ? error.message : 'Could not delete donation',
        )
    }
}

    // Related IDs may be populated objects from Mongoose or plain IDs in other responses.
    return(
        <article className="donation-details">
            <h3>Donation {donation._id}</h3>
            <p><strong>Status:</strong> {donation.donation_status}</p>
            <p><strong>Donor ID:</strong> {donation.donor_id?._id ?? donation.donor_id}</p>
            {donation.calamity_id && (
                <p>
                    <strong>Calamity:</strong>{' '}
                    {donation.calamity_id.calamity_name ?? donation.calamity_id}
                </p>
            )}
            <h4>Items</h4>
            {donation.items?.map((item) => (
                <p key={item._id}>
                    {item.item_name} — {item.quantity} {item.unit} ({item.category})
                </p>
            ))}
            <p>
                <strong>Pickup:</strong>{' '}
                {[
                    donation.pickup_house_number,
                    donation.pickup_street,
                    donation.pickup_barangay,
                    donation.pickup_city_municipality,
                    donation.pickup_province,
                    donation.pickup_postal_code,
                ].filter(Boolean).join(', ') || 'Not provided'}
            </p>
            <button type="button" onClick={handleClick}>Delete donation</button>
            {deleteError && <p role="alert">{deleteError}</p>}
        </article>
    )
}


export default DonationDetails
