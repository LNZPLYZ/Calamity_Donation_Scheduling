import { useState } from 'react'
import { useDonationContext } from '../../hooks/useDonationContext.js'
import {
  Alert, Box, Button, Stack, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material'


// Use the same starting shape whenever the user adds or clears an item row.
const createEmptyItem = () => ({
    item_name: '',
    category: 'Food',
    quantity: '',
    unit: '',
    item_condition: '',
})

const DonationForm = () => {
    // The server-created donation is added to the shared list after a successful save.
    const { dispatch } = useDonationContext()

    // Each state value controls one part of the form until it is submitted.
    const [donorId, setDonorId] = useState('')
    const [calamityId, setCalamityId] = useState('')
    const [pickupAddress, setPickupAddress] = useState({
        pickup_house_number: '',
        pickup_street: '',
        pickup_barangay: '',
        pickup_city_municipality: '',
        pickup_province: '',
        pickup_postal_code: '',
    })
    const [items, setItems] = useState([createEmptyItem()])
    const [error, setError] = useState(null)

    // Convert the form state into the JSON shape expected by POST /api/donations.
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        try {
            // Trim IDs and convert quantity text to a number before sending the request.
            const donation = {
                donor_id: donorId.trim(),
                ...(calamityId.trim() && { calamity_id: calamityId.trim() }),
                ...pickupAddress,
                items: items.map((item) => ({
                    ...item,
                    item_name: item.item_name.trim(),
                    quantity: Number(item.quantity),
                })),
            }
            // The dev-server proxy forwards this API request to the Express backend.
            const response = await fetch('/api/donations', {
                method: 'POST',
                body: JSON.stringify(donation),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const json = await response.json()

            if (!response.ok) {
                throw new Error(json.error || 'Could not create donation')
            }

            // Clear the form only after the backend has saved and returned the donation.
            setDonorId('')
            setCalamityId('')
            setPickupAddress({
                pickup_house_number: '',
                pickup_street: '',
                pickup_barangay: '',
                pickup_city_municipality: '',
                pickup_province: '',
                pickup_postal_code: '',
            })
            setItems([createEmptyItem()])
            setError(null)
            // Keep the page in sync without reloading the full list.
            dispatch({ type: 'CREATE_DONATION', payload: json })
        } catch (submitError) {
            // Display validation or server errors next to the form.
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : 'Could not create donation',
            )
        }
    }

    return (

        <Box 
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 'flex', mx: 'auto', p: 10}}>

        <Stack spacing={3}> 

     <form className="Create" onSubmit={handleSubmit}>
            <h3>Add a Donation</h3>

        <Box sx ={{ display: 'flex', mx: 'auto', gap: 5 }}> 
             <TextField
                placeholder='Donor ID'
                id="donor-id"
                type="text"
                size='small'
                value={donorId}
                onChange={(e) => setDonorId(e.target.value)}
                required
            />

           
            <TextField
                placeholder='Calamity ID'
                id="calamity-id"
                type="text"
                size='small'
                value={calamityId}
                onChange={(e) => setCalamityId(e.target.value)}
                required
            />
        </Box>
           

        <Box>
            <h4>Pickup address</h4>
            {/* Generate one controlled input for each address property. */}
            {[
                ['pickup_house_number', 'House / building number'],
                ['pickup_street', 'Street'],
                ['pickup_barangay', 'Barangay'],
                ['pickup_city_municipality', 'City / municipality'],
                ['pickup_province', 'Province'],
                ['pickup_postal_code', 'Postal code'],
            ].map(([field, label]) => (
                <InputLabel key={field}>
                    {label}
                    <TextField sx ={{ display: 'flex', mx: 'auto', gap: 5 }}
                        type="text"
                        size='small'
                        value={pickupAddress[field]}
                        onChange={(e) =>
                            setPickupAddress((address) => ({
                                ...address,
                                [field]: e.target.value,
                            }))
                        }
                    />
                </InputLabel>
            ))}

         </Box>

        <Box sx={{ maxWidth: 'flex', mx: 'auto', p: 3}} >
            <h4>Donation items</h4>
            {/* An item row is edited immutably so React can detect each state change. */}
            {items.map((item, index) => (
                <fieldset key={index}>
                    <legend>Item {index + 1}</legend>
                    <InputLabel>
                        Item name
                        <TextField sx ={{ display: 'flex', mx: 'auto', gap: 5 }}
                            type="text"
                            size='small'
                            value={item.item_name}
                            onChange={(e) =>
                                setItems((currentItems) =>
                                    currentItems.map((currentItem, itemIndex) =>
                                        itemIndex === index
                                            ? { ...currentItem, item_name: e.target.value }
                                            : currentItem,
                                    ),
                                )
                            }
                            required
                        />
                    </InputLabel>
                    <InputLabel>
                        Category
                        <Select
                            size='small'
                            value={item.category}
                            onChange={(e) =>
                                setItems((currentItems) =>
                                    currentItems.map((currentItem, itemIndex) =>
                                        itemIndex === index
                                            ? { ...currentItem, category: e.target.value }
                                            : currentItem,
                                    ),
                                )
                            }
                        >
                            {['Food', 'Clothing', 'Medicine', 'Hygiene', 'Other'].map(
                                (category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ),
                            )}
                        </Select>
                    </InputLabel>
                    <InputLabel>
                        Quantity
                        <TextField
                            size='small'
                            type="number"
                            min="0"
                            step="any"
                            value={item.quantity}
                            onChange={(e) =>
                                setItems((currentItems) =>
                                    currentItems.map((currentItem, itemIndex) =>
                                        itemIndex === index
                                            ? { ...currentItem, quantity: e.target.value }
                                            : currentItem,
                                    ),
                                )
                            }
                            required
                        />
                    </InputLabel>
                    <InputLabel>
                        Unit
                        <TextField
                            type="text"
                            size='small'
                            value={item.unit}
                            onChange={(e) =>
                                setItems((currentItems) =>
                                    currentItems.map((currentItem, itemIndex) =>
                                        itemIndex === index
                                            ? { ...currentItem, unit: e.target.value }
                                            : currentItem,
                                    ),
                                )
                            }
                        />
                    </InputLabel>
                    <InputLabel>
                        Item condition
                        <input
                            type="text"
                            value={item.item_condition}
                            onChange={(e) =>
                                setItems((currentItems) =>
                                    currentItems.map((currentItem, itemIndex) =>
                                        itemIndex === index
                                            ? { ...currentItem, item_condition: e.target.value }
                                            : currentItem,
                                    ),
                                )
                            }
                        />
                    </InputLabel>
                    {items.length > 1 && (
                        // Keep at least one item because the backend requires a non-empty list.
                        <Button
                            type="button"
                            onClick={() =>
                                setItems((currentItems) =>
                                    currentItems.filter((_, itemIndex) => itemIndex !== index),
                                )
                            }
                        >
                            Remove item
                        </Button>
                    )}
                </fieldset> 
            ))}
        </Box>
            {/* Add another independently editable item to the same donation request. */}
            <Box> 

                <Button type="button" onClick={() => setItems((current) => [...current, createEmptyItem()])}>
                    Add another item
                </Button>
                <Button type="submit">Submit donation</Button>
                {error && <div className="error" role="alert">{error}</div>}
                
            </Box>

      

        
             </form>
    </Stack>            
</Box>





       
    )
}

export default DonationForm
