import axios from 'axios';

export const getTherapyRecommendation = async userData => {
  try {
    const response = await api.post('/recommendation', userData);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
