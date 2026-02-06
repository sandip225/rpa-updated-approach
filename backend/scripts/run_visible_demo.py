import os
import traceback
from app.services.torrent_rpa_service import TorrentPowerRPA

# Ensure visible browser
os.environ['HEADLESS'] = '0'

sample_data = {
    "city": "Ahmedabad",
    "service_number": "TEST123456",
    "t_number": "T123456789",
    "mobile": "9876543210",
    "email": "test@example.com"
}

print('Starting visible RPA demo (browser will stay open for ~10 minutes)...')
try:
    r = TorrentPowerRPA()
    options = {'interactive': True, 'pause_between': 1, 'keep_open': 600}
    result = r.run_visible_automation(sample_data, options=options)
    print('Visible run result:')
    print(result)
except Exception:
    traceback.print_exc()

print('Demo script finished')