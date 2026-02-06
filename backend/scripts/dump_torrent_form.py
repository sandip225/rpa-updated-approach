import os
import traceback
from app.services.torrent_rpa_service import TorrentPowerRPA

os.environ['HEADLESS'] = '0'

r = TorrentPowerRPA()
try:
    ok = r.setup_driver()
    print('Driver OK:', ok)
    if not ok:
        raise SystemExit('Driver setup failed')

    if not r.navigate_to_torrent_power():
        raise SystemExit('Navigation failed')

    # Save page source
    src = r.driver.page_source
    with open('torrent_page_source.html', 'w', encoding='utf-8') as f:
        f.write(src)
    print('Saved page source to torrent_page_source.html')

    # List input/select elements with attributes
    elems = r.driver.find_elements('css selector', 'input,select,textarea')
    print(f'Found {len(elems)} input/select/textarea elements')
    for i, e in enumerate(elems[:100], start=1):
        tag = e.tag_name
        attrs = {
            'id': e.get_attribute('id'),
            'name': e.get_attribute('name'),
            'type': e.get_attribute('type'),
            'placeholder': e.get_attribute('placeholder'),
            'class': e.get_attribute('class'),
            'aria-label': e.get_attribute('aria-label')
        }
        print(f"{i:02d}. <{tag}> attrs={attrs}")

    # Also try to find visible textareas and labels
    labels = r.driver.find_elements('css selector', 'label')
    print(f'Found {len(labels)} label elements (showing first 20):')
    for lbl in labels[:20]:
        print(' -', lbl.text.strip()[:120])

except Exception:
    traceback.print_exc()
finally:
    try:
        print('Keeping browser open for 30 seconds for inspection...')
        import time
        time.sleep(30)
    except Exception:
        pass
    try:
        r.close_driver()
    except Exception:
        pass
    print('Done')