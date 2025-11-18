import axios from 'axios';

const testEquipmentRoute = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/equipment/3');
    console.log(response.data);
  } catch (error) { 
    console.error('Error fetching equipment data:', error);
  }
};

testEquipmentRoute();
