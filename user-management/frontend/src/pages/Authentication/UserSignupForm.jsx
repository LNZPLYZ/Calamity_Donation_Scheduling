import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert, Box, Button, Stack, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material'

const UserSignupForm = () => {
 const navigate = useNavigate()

  const [first_name, setFname] = useState('')
  const [middle_name, setMname] = useState('')
  const [last_name, setLname] = useState('')
  const [suffix, setSuffixname] = useState('')
  const [birth_date, setBirthdate] = useState('')
  const [gender, setGender] = useState('')
  const [contact_number, setContactnumber] = useState('')
  const [house_number, setHousenumber] = useState('')
  const [street, setStreet] = useState('')
  const [barangay, setBarangay] = useState('')
  const [city_municipality, setCitymunicipality] = useState('')
  const [province, setProvince] = useState('')
  const [postal_code, setPostalcode] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

 

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            first_name,
            middle_name,
            last_name,
            suffix,
            birth_date,
            gender,
            contact_number,
            house_number,
            street,
            barangay,
            city_municipality,
            province,
            postal_code,

            email,
            password
        
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Could not sign up.')
      }

      setSuccess(`Welcome, ${result.user.first_name}.`)
      setPassword('')

      navigate('/donations')

    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Could not sign up. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  return (


    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 400, mx: 'auto', p: 3}}
    >
      <Stack spacing={2}>
        <Typography variant="h5" >Sign up</Typography>

          <Typography variant="h7">  A. Personal Information </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                  placeholder = "First Name"
                  type = "text"
                  value={first_name}
                  onChange={(event) => setFname(event.target.value)}
                  required
                />
                <TextField
                
                  placeholder = "Middle Name"
                  type = "text"
                  value={middle_name}
                  onChange={(event) => setMname(event.target.value)}
                  
                />       

        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>

                <TextField
                
                  placeholder = "Last Name"
                  type = "text"
                  value={last_name}
                  onChange={(event) => setLname(event.target.value)}
                  required
                />     
                
                <TextField
                  placeholder = "Suffix (Jr., Sr., III)"
                  type = "text"
                  value={suffix}
                  onChange={(event) => setSuffixname(event.target.value)}
                  
                />          

        </Box>



        <TextField
        
          placeholder="Birth Date"
          type="date"
          value={birth_date}
          onChange={(event) => setBirthdate(event.target.value)}
          required
          
        />

        <FormControl fullWidth>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            id="gender"
            value={gender}
            label="Gender"
            onChange={(event) => setGender(event.target.value)}
          >
            <MenuItem value={"Male"}>Male</MenuItem>
            <MenuItem value={"Female"}>Female</MenuItem>
    
          </Select>
        </FormControl>

        <Typography variant="h7">  B. Contact Information </Typography>

        <TextField
          placeholder="Contact Number"
          type="text"
          value={contact_number}
          onChange={(event) => setContactnumber(event.target.value)}
          required
        />

        <TextField
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
    
          <Typography variant="h7">  C. Complete Address </Typography>

        <Box sx={{ display: 'flex', gap: 2  }}>

        <TextField
          placeholder="House #"
          type="text"
          value={house_number}
          onChange={(event) => setHousenumber(event.target.value)}
        />

        <TextField
          placeholder="Street"  
          type="text"
          value={street}
          onChange={(event) => setStreet(event.target.value)}
        />  
 
        </Box>

        <TextField
          placeholder="Barangay"  
          type="text"
          value={barangay}
          onChange={(event) => setBarangay(event.target.value)}
        />  

        <Box sx={{ display: 'flex', gap: 2 }}>
          
        <TextField
          placeholder="City"  
          type="text"
          value={city_municipality}
          onChange={(event) => setCitymunicipality(event.target.value)}
        />  

        <TextField
          placeholder="Province"  
          type="text"
          value={province}
          onChange={(event) => setProvince(event.target.value)}
        /> 
        </Box>


        <TextField
          placeholder="Postal Code"  
          type="text"
          value={postal_code}
          onChange={(event) => setPostalcode(event.target.value)}
        />

          <Typography variant="h7">  D. Account Credentials </Typography>

        <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        inputProps={{ minLength: 8, maxLength: 1024 }}
        required
        />
 
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </Button>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Stack>
    </Box>
  )

}

export default UserSignupForm 
