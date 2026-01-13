# RPA Automation Scripts

Official website automation scripts for form filling with submit button disabled.

## Structure

```
rpa-automation/
├── common/
│   └── base_rpa.py          # Base class for all RPA scripts
├── torrent_power/
│   └── torrent_power_rpa.py # Torrent Power automation
├── gujarat_gas/
│   └── gujarat_gas_rpa.py   # Gujarat Gas automation
├── anyror_property/
│   └── anyror_rpa.py        # AnyROR Property automation
├── amc_water/
│   └── amc_water_rpa.py     # AMC Water automation
└── requirements.txt
```

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Torrent Power

```python
from torrent_power.torrent_power_rpa import TorrentPowerRPA

rpa = TorrentPowerRPA(headless=False)

form_data = {
    'service_number': 'TP123456789',
    'old_name': 'Rajesh Kumar',
    'new_name': 'Rajesh Kumar Singh',
    'mobile': '9876543210',
    'email': 'rajesh@example.com'
}

result = rpa.fill_name_change_form(form_data)
print(result)
```

## Features

- ✓ Automatic form filling
- ✓ Submit button disabled
- ✓ Screenshot capture
- ✓ Error handling
- ✓ Logging

## Supported Services

1. **Torrent Power** - Name Change
   - Portal: https://connect.torrentpower.com/
   - Status: ✓ Ready

2. **Gujarat Gas** - Name Change
   - Portal: https://iconnect.gujaratgas.com/
   - Status: Coming Soon

3. **AnyROR Property** - Name Transfer
   - Portal: https://anyror.gujarat.gov.in/
   - Status: Coming Soon

4. **AMC Water** - Name Change
   - Portal: https://ahmedabadcity.gov.in/
   - Status: Coming Soon

## Notes

- All scripts disable submit button to prevent actual submission
- Screenshots are saved for verification
- Headless mode can be disabled for debugging
- All data is dummy/test data only
