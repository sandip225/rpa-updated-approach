export const allServices = {
  electricity: {
    name: 'Electricity Services',
    nameGuj: 'बिजली सेवाएं',
    icon: '⚡',
    services: [
      { id: 'name_change', name: 'Name Change', nameGuj: 'नाम परिवर्तन', fees: 'Free', time: '3-5 days' },
      { id: 'new_connection', name: 'New Connection', nameGuj: 'नया कनेक्शन', fees: '₹500-2000', time: '7-15 days' },
      { id: 'bill_complaint', name: 'Bill Complaint', nameGuj: 'बिल शिकायत', fees: 'Free', time: '1-3 days' }
    ]
  },
  gas: {
    name: 'Gas Services',
    nameGuj: 'गैस सेवाएं',
    icon: '🔥',
    services: [
      { id: 'name_change', name: 'Name Change', nameGuj: 'नाम परिवर्तन', fees: 'Free', time: '3-5 days' },
      { id: 'new_connection', name: 'New Connection', nameGuj: 'नया कनेक्शन', fees: '₹1500-3000', time: '10-15 days' },
      { id: 'cylinder_booking', name: 'Cylinder Booking', nameGuj: 'सिलेंडर बुकिंग', fees: 'As per rate', time: '1-2 days' }
    ]
  },
  water: {
    name: 'Water Services',
    nameGuj: 'जल सेवाएं',
    icon: '💧',
    services: [
      { id: 'name_change', name: 'Name Change', nameGuj: 'नाम परिवर्तन', fees: 'Free', time: '3-5 days' },
      { id: 'new_connection', name: 'New Connection', nameGuj: 'नया कनेक्शन', fees: '₹1000-2500', time: '7-15 days' },
      { id: 'complaint', name: 'Water Supply Complaint', nameGuj: 'जल आपूर्ति शिकायत', fees: 'Free', time: '1-3 days' }
    ]
  },
  property: {
    name: 'Property Services',
    nameGuj: 'संपत्ति सेवाएं',
    icon: '🏠',
    services: [
      { id: 'name_transfer', name: 'Name Transfer', nameGuj: 'नाम स्थानांतरण', fees: '₹2000-5000', time: '15-30 days' },
      { id: 'mutation', name: 'Property Mutation', nameGuj: 'संपत्ति परिवर्तन', fees: '₹1000-3000', time: '10-20 days' },
      { id: 'tax_payment', name: 'Property Tax Payment', nameGuj: 'संपत्ति कर भुगतान', fees: 'As per assessment', time: 'Instant' }
    ]
  }
};

export default allServices;