import os
import traceback
from app.services.torrent_rpa_service import TorrentPowerRPA

print('HEADLESS env:', os.getenv('HEADLESS'))

r = TorrentPowerRPA()
try:
    ok = r.setup_driver()
    print('Driver setup returned:', ok)
    if ok and getattr(r, 'driver', None):
        try:
            r.driver.get('https://www.google.com')
            print('Page title:', r.driver.title)
        except Exception as e:
            print('Navigation error:')
            traceback.print_exc()
        finally:
            print('Closing driver...')
            try:
                r.close_driver()
            except Exception:
                traceback.print_exc()
    else:
        print('Driver not initialized')
except Exception:
    print('Exception during setup:')
    traceback.print_exc()

print('Driver check script finished')