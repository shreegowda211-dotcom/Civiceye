const express = require('express');
const router = express.Router();

const INDIAN_STATES = [
  { iso2: 'AN', name: 'Andaman and Nicobar Islands' },
  { iso2: 'AP', name: 'Andhra Pradesh' },
  { iso2: 'AR', name: 'Arunachal Pradesh' },
  { iso2: 'AS', name: 'Assam' },
  { iso2: 'BR', name: 'Bihar' },
  { iso2: 'CH', name: 'Chandigarh' },
  { iso2: 'CT', name: 'Chhattisgarh' },
  { iso2: 'DL', name: 'Delhi' },
  { iso2: 'GA', name: 'Goa' },
  { iso2: 'GJ', name: 'Gujarat' },
  { iso2: 'HR', name: 'Haryana' },
  { iso2: 'HP', name: 'Himachal Pradesh' },
  { iso2: 'JK', name: 'Jammu and Kashmir' },
  { iso2: 'JH', name: 'Jharkhand' },
  { iso2: 'KA', name: 'Karnataka' },
  { iso2: 'KL', name: 'Kerala' },
  { iso2: 'LA', name: 'Ladakh' },
  { iso2: 'MH', name: 'Maharashtra' },
  { iso2: 'ML', name: 'Meghalaya' },
  { iso2: 'MN', name: 'Manipur' },
  { iso2: 'MP', name: 'Madhya Pradesh' },
  { iso2: 'MZ', name: 'Mizoram' },
  { iso2: 'NL', name: 'Nagaland' },
  { iso2: 'OR', name: 'Odisha' },
  { iso2: 'PB', name: 'Punjab' },
  { iso2: 'PY', name: 'Puducherry' },
  { iso2: 'RJ', name: 'Rajasthan' },
  { iso2: 'SK', name: 'Sikkim' },
  { iso2: 'TN', name: 'Tamil Nadu' },
  { iso2: 'TG', name: 'Telangana' },
  { iso2: 'TR', name: 'Tripura' },
  { iso2: 'UP', name: 'Uttar Pradesh' },
  { iso2: 'UT', name: 'Uttarakhand' },
  { iso2: 'WB', name: 'West Bengal' },
];

const CITY_LOOKUP = {
  KA: [
    { name: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
    { name: 'Mysore', latitude: 12.2958, longitude: 76.6394 },
    { name: 'Mangalore', latitude: 12.9141, longitude: 74.8560 },
    { name: 'Hubli', latitude: 15.3647, longitude: 75.1230 },
  ],
  MH: [
    { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
    { name: 'Pune', latitude: 18.5204, longitude: 73.8567 },
    { name: 'Nagpur', latitude: 21.1458, longitude: 79.0882 },
    { name: 'Nashik', latitude: 20.0110, longitude: 73.7904 },
  ],
  DL: [
    { name: 'New Delhi', latitude: 28.6139, longitude: 77.2090 },
    { name: 'Dwarka', latitude: 28.5900, longitude: 77.0384 },
    { name: 'Rohini', latitude: 28.7385, longitude: 77.1094 },
  ],
  TN: [
    { name: 'Chennai', latitude: 13.0827, longitude: 80.2707 },
    { name: 'Coimbatore', latitude: 11.0168, longitude: 76.9558 },
    { name: 'Madurai', latitude: 9.9252, longitude: 78.1198 },
  ],
  WB: [
    { name: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
    { name: 'Howrah', latitude: 22.5958, longitude: 88.2636 },
    { name: 'Durgapur', latitude: 23.5204, longitude: 87.3119 },
  ],
  GJ: [
    { name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714 },
    { name: 'Surat', latitude: 21.1702, longitude: 72.8311 },
    { name: 'Vadodara', latitude: 22.3072, longitude: 73.1812 },
  ],
};

router.get('/countries', (req, res) => {
  res.json({ success: true, data: [{ iso2: 'IN', name: 'India', emoji: '🇮🇳', phone_code: '91' }] });
});

router.get('/states/:countryIso2', (req, res) => {
  const { countryIso2 } = req.params;
  if (countryIso2 !== 'IN') {
    return res.status(404).json({ success: false, message: 'Country not supported' });
  }
  res.json({ success: true, data: INDIAN_STATES });
});

router.get('/cities/:countryIso2/:stateIso2', (req, res) => {
  const { countryIso2, stateIso2 } = req.params;
  if (countryIso2 !== 'IN') {
    return res.status(404).json({ success: false, message: 'Country not supported' });
  }
  const cities = CITY_LOOKUP[stateIso2] || [];
  res.json({ success: true, data: cities });
});

router.get('/reverse', (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ success: false, message: 'lat and lng are required' });
  }
  res.json({
    success: true,
    data: {
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      area: 'Central Business District',
      formatted: 'Central Business District, Bangalore, KA',
      latitude: Number(lat),
      longitude: Number(lng),
    },
  });
});

router.get('/forward', (req, res) => {
  const q = req.query.q || '';
  res.json({ success: true, data: [{ formatted: q || 'Bangalore, KA', latitude: 12.9716, longitude: 77.5946 }] });
});

module.exports = router;
