// All Gujarat Suppliers with their official portal URLs for Name Change
export const suppliers = {
  gas: {
    name: 'Gas',
    nameHindi: 'गैस',
    suppliers: [
      {
        id: 'gujarat-gas',
        name: 'Gujarat Gas',
        type: 'Government',
        areas: 'Surat, Bharuch, Ankleshwar, Vapi',
        portal: 'https://www.gujaratgas.com',
        nameChangeUrl: 'https://iconnect.gujaratgas.com/Portal/outer-service-request_template.aspx',
        offlineForm: 'https://iconnect.gujaratgas.com/Portal/Upload.ashx?EncQuery=RbfX54x4vIZzhOBRSRfWTZbXAG7f3AbEg0f7VkvFfGVZliNT3OTix7df9NjIu7AFUPL8Mhq17Uk8uDKp9EzcvQ%3D%3D',
        hasOnlinePortal: true,
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email', 'address']
      },
      {
        id: 'sabarmati-gas',
        name: 'Sabarmati Gas',
        type: 'Government',
        areas: 'Gandhinagar, Mehsana, Sabarkantha',
        portal: 'https://www.sabarmatigas.in',
        nameChangeUrl: 'https://www.sabarmatigas.in',
        hasOnlinePortal: false,
        offlineNote: 'No online portal available - Visit local Sabarmati Gas office for offline forms',
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email', 'address']
      },
      {
        id: 'adani-gas',
        name: 'Adani Total Gas',
        type: 'Private',
        areas: 'Ahmedabad, Vadodara, Faridabad',
        portal: 'https://www.adanigas.com',
        nameChangeUrl: 'https://www.adanigas.com/name-transfer',
        offlineForm: 'https://www.adanigas.com',
        hasOnlinePortal: true,
        fields: ['bp_number', 'applicant_name', 'mobile', 'email', 'address']
      },
      {
        id: 'torrent-gas',
        name: 'Torrent Gas',
        type: 'Private',
        areas: 'Ahmedabad (select areas)',
        portal: 'https://connect.torrentgas.com',
        nameChangeUrl: 'https://connect.torrentgas.com',
        offlineForm: 'https://connect.torrentgas.com/attachments/static_content/download_page/Name_Transfer_Application_form_all_Locations_domestic.pdf',
        hasOnlinePortal: false,
        offlineNote: 'Download offline form - No direct online submission',
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email']
      },
      {
        id: 'vadodara-gas',
        name: 'Vadodara Gas (VGL)',
        type: 'Private',
        areas: 'Vadodara',
        portal: 'https://www.vgl.co.in',
        nameChangeUrl: 'https://www.vgl.co.in',
        offlineForm: 'https://www.vgl.co.in/sdm_downloads/affidavit-for-family-member-2-2/',
        hasOnlinePortal: false,
        offlineNote: 'No online portal - Download affidavit form for name transfer',
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email']
      },
      {
        id: 'irm-energy',
        name: 'IRM Energy',
        type: 'Private',
        areas: 'Banaskantha, Sabarkantha',
        portal: 'https://www.irmenergy.com',
        nameChangeUrl: 'https://www.irmenergy.com',
        hasOnlinePortal: false,
        offlineNote: 'No online portal - Contact IRM Energy office directly',
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email']
      }
    ]
  },
  electricity: {
    name: 'Electricity',
    nameHindi: 'बिजली',
    suppliers: [
      {
        id: 'torrent-power',
        name: 'Torrent Power',
        type: 'Private',
        areas: 'Ahmedabad, Gandhinagar, Surat',
        portal: 'https://www.torrentpower.com',
        nameChangeUrl: 'https://connect.torrentpower.com',
        offlineForm: 'https://www.torrentpower.com/public/pdf/investors/AHDAHDNameChangeLTENGForm2407191_20211129182958.pdf',
        hasOnlinePortal: false,
        offlineNote: 'Online name change form not available - Download offline form PDF and submit at Torrent Power office',
        fields: ['city', 'service_number', 't_no', 'applicant_name', 'mobile', 'email']
      },
      {
        id: 'pgvcl',
        name: 'PGVCL',
        fullName: 'Paschim Gujarat Vij Company Ltd',
        type: 'Government',
        areas: 'Rajkot, Jamnagar, Junagadh, Porbandar',
        portal: 'https://www.pgvcl.com',
        nameChangeUrl: 'https://portal.guvnl.in/login.php',
        hasOnlinePortal: true,
        offlineNote: 'Offline forms also available at PGVCL office',
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email', 'address']
      },
      {
        id: 'ugvcl',
        name: 'UGVCL',
        fullName: 'Uttar Gujarat Vij Company Ltd',
        type: 'Government',
        areas: 'Mehsana, Sabarkantha, Banaskantha, Patan',
        portal: 'https://www.ugvcl.com',
        nameChangeUrl: 'https://portal.guvnl.in/login.php',
        hasOnlinePortal: true,
        offlineNote: 'Offline forms also available at UGVCL office',
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email', 'address']
      },
      {
        id: 'mgvcl',
        name: 'MGVCL',
        fullName: 'Madhya Gujarat Vij Company Ltd',
        type: 'Government',
        areas: 'Vadodara, Anand, Kheda, Dahod',
        portal: 'https://www.mgvcl.com',
        nameChangeUrl: 'https://portal.guvnl.in/login.php',
        hasOnlinePortal: true,
        offlineNote: 'Offline forms also available at MGVCL office',
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email', 'address']
      },
      {
        id: 'dgvcl',
        name: 'DGVCL',
        fullName: 'Dakshin Gujarat Vij Company Ltd',
        type: 'Government',
        areas: 'Surat, Navsari, Valsad, Bharuch',
        portal: 'https://www.dgvcl.com',
        nameChangeUrl: 'https://portal.guvnl.in/login.php',
        hasOnlinePortal: true,
        offlineNote: 'Offline forms also available at DGVCL office',
        fields: ['consumer_number', 'applicant_name', 'mobile', 'email', 'address']
      }
    ]
  },
  water: {
    name: 'Water',
    nameHindi: 'पानी',
    suppliers: [
      {
        id: 'gwssb',
        name: 'GWSSB',
        fullName: 'Gujarat Water Supply & Sewerage Board',
        type: 'Government',
        areas: 'Rural Gujarat',
        portal: 'https://gwssb.gujarat.gov.in',
        nameChangeUrl: 'https://gwssb.gujarat.gov.in',
        offlineForm: 'https://watersupply.gujarat.gov.in/forms',
        hasOnlinePortal: false,
        offlineNote: 'No online portal - Download forms from watersupply.gujarat.gov.in/forms',
        fields: ['connection_number', 'applicant_name', 'mobile', 'email', 'village', 'taluka', 'district']
      },
      {
        id: 'amc-water',
        name: 'AMC Water',
        fullName: 'Ahmedabad Municipal Corporation',
        type: 'Government',
        areas: 'Ahmedabad City',
        portal: 'https://ahmedabadcity.gov.in',
        nameChangeUrl: 'https://ahmedabadcity.gov.in',
        hasOnlinePortal: false,
        offlineNote: 'No online portal - Visit AMC office for forms (no specific download available)',
        fields: ['connection_number', 'applicant_name', 'mobile', 'email', 'address', 'zone']
      },
      {
        id: 'smc-water',
        name: 'SMC Water',
        fullName: 'Surat Municipal Corporation',
        type: 'Government',
        areas: 'Surat City',
        portal: 'https://www.suratmunicipal.gov.in',
        nameChangeUrl: 'https://www.suratmunicipal.gov.in',
        hasOnlinePortal: false,
        offlineNote: 'No online portal - Printable forms available at SMC office or check SMC website',
        fields: ['connection_number', 'applicant_name', 'mobile', 'email', 'address']
      },
      {
        id: 'vmc-water',
        name: 'VMC Water',
        fullName: 'Vadodara Municipal Corporation',
        type: 'Government',
        areas: 'Vadodara City',
        portal: 'https://vmc.gov.in',
        nameChangeUrl: 'https://vmc.gov.in',
        hasOnlinePortal: false,
        offlineNote: 'No online portal - Visit VMC office for forms',
        fields: ['connection_number', 'applicant_name', 'mobile', 'email', 'address']
      },
      {
        id: 'rmc-water',
        name: 'RMC Water',
        fullName: 'Rajkot Municipal Corporation',
        type: 'Government',
        areas: 'Rajkot City',
        portal: 'https://www.rmc.gov.in',
        nameChangeUrl: 'https://www.rmc.gov.in',
        hasOnlinePortal: false,
        offlineNote: 'No online portal - Visit RMC office for forms',
        fields: ['connection_number', 'applicant_name', 'mobile', 'email', 'address']
      }
    ]
  },
  property: {
    name: 'Property',
    nameHindi: 'संपत्ति',
    suppliers: [
      {
        id: 'anyror',
        name: 'AnyROR Gujarat',
        fullName: 'Revenue Department - Land Records (Form 6)',
        type: 'Government',
        areas: 'All Gujarat - 7/12, 8A Records',
        portal: 'https://anyror.gujarat.gov.in',
        nameChangeUrl: 'https://anyror.gujarat.gov.in',
        offlineForm: 'https://revenuedepartment.gujarat.gov.in/e-dhara-forms',
        hasOnlinePortal: true,
        fields: ['survey_number', 'village', 'taluka', 'district', 'applicant_name', 'mobile']
      },
      {
        id: 'e-dhara',
        name: 'e-Dhara',
        fullName: 'Revenue Department - Mutation (Form 6)',
        type: 'Government',
        areas: 'All Gujarat - Land Mutation',
        portal: 'https://landrecords.gujarat.gov.in',
        nameChangeUrl: 'https://edhara.gujarat.gov.in',
        offlineForm: 'https://revenuedepartment.gujarat.gov.in/e-dhara-forms',
        hasOnlinePortal: true,
        fields: ['survey_number', 'village', 'taluka', 'district', 'applicant_name', 'mobile']
      },
      {
        id: 'e-nagar',
        name: 'e-Nagar',
        fullName: 'Urban Development - Property Tax',
        type: 'Government',
        areas: 'Urban Areas - Property Tax',
        portal: 'https://enagar.gujarat.gov.in',
        nameChangeUrl: 'https://enagar.gujarat.gov.in',
        offlineForm: 'https://revenuedepartment.gujarat.gov.in/e-dhara-forms',
        hasOnlinePortal: true,
        fields: ['property_id', 'ward', 'city', 'applicant_name', 'mobile', 'email']
      },
      {
        id: 'talati',
        name: 'Talati (Village Officer)',
        fullName: 'Revenue Department - Village Level (Form 6)',
        type: 'Government',
        areas: 'All Gujarat Villages',
        portal: 'https://revenuedepartment.gujarat.gov.in',
        nameChangeUrl: 'https://anyror.gujarat.gov.in',
        offlineForm: 'https://revenuedepartment.gujarat.gov.in/e-dhara-forms',
        hasOnlinePortal: false,
        offlineNote: 'Visit local Talati office with Form 6 - Download from e-Dhara forms',
        fields: ['survey_number', 'village', 'taluka', 'district', 'applicant_name', 'mobile']
      },
      {
        id: 'mamlatdar',
        name: 'Mamlatdar / Tehsildar',
        fullName: 'Taluka Revenue Office',
        type: 'Government',
        areas: 'All Gujarat Talukas',
        portal: 'https://revenuedepartment.gujarat.gov.in',
        nameChangeUrl: 'https://revenuedepartment.gujarat.gov.in',
        offlineForm: 'https://revenuedepartment.gujarat.gov.in/e-dhara-forms',
        hasOnlinePortal: false,
        offlineNote: 'Visit Taluka Revenue Office with Form 6 - Download from e-Dhara forms',
        fields: ['survey_number', 'village', 'taluka', 'district', 'applicant_name', 'mobile']
      },
      {
        id: 'indiafilings',
        name: 'IndiaFilings',
        fullName: 'Private Consultant - Gujarat Land Mutation',
        type: 'Private',
        areas: 'All Gujarat - Consulting Services',
        portal: 'https://www.indiafilings.com',
        nameChangeUrl: 'https://www.indiafilings.com/learn/gujarat-land-mutation/',
        offlineForm: 'https://revenuedepartment.gujarat.gov.in/e-dhara-forms',
        hasOnlinePortal: true,
        offlineNote: 'Private consultant - Uses govt Form 6',
        fields: ['survey_number', 'village', 'taluka', 'district', 'applicant_name', 'mobile', 'email']
      },
      {
        id: 'ezylegal',
        name: 'ezyLegal',
        fullName: 'Private Legal & Property Services',
        type: 'Private',
        areas: 'All Gujarat - Legal Services',
        portal: 'https://www.ezylegal.in',
        nameChangeUrl: 'https://ezylegal.in/property',
        offlineForm: 'https://revenuedepartment.gujarat.gov.in/e-dhara-forms',
        hasOnlinePortal: true,
        offlineNote: 'Private consultant - Uses govt Form 6',
        fields: ['survey_number', 'village', 'taluka', 'district', 'applicant_name', 'mobile', 'email']
      }
    ]
  }
};

// Get all suppliers for a category
export const getSuppliers = (category) => {
  return suppliers[category]?.suppliers || [];
};

// Get supplier by ID
export const getSupplierById = (category, supplierId) => {
  const categoryData = suppliers[category];
  if (!categoryData) return null;
  return categoryData.suppliers.find(s => s.id === supplierId);
};
