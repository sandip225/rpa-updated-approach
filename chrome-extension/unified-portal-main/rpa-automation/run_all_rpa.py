"""
Master RPA Script
Runs all RPA automations for all services
"""
import logging
from torrent_power import TorrentPowerRPA
from adani_gas import AdaniGasRPA
from guvnl_electricity import GUVNLElectricityRPA
from amc_water import AMCWaterRPA
from anyror_property import AnyRORPropertyRPA
from gujarat_gas import GujaratGasRPA

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RPA_Master:
    def __init__(self):
        self.results = []
    
    def run_torrent_power(self, form_data):
        """Run Torrent Power automation"""
        logger.info("\n" + "="*70)
        logger.info("RUNNING: TORRENT POWER")
        logger.info("="*70)
        rpa = TorrentPowerRPA(headless=False)
        result = rpa.fill_name_change_form(form_data)
        self.results.append(result)
        return result
    
    def run_adani_gas(self, form_data):
        """Run Adani Gas automation"""
        logger.info("\n" + "="*70)
        logger.info("RUNNING: ADANI GAS")
        logger.info("="*70)
        rpa = AdaniGasRPA(headless=False)
        result = rpa.fill_name_change_form(form_data)
        self.results.append(result)
        return result
    
    def run_guvnl_electricity(self, form_data):
        """Run GUVNL Electricity automation"""
        logger.info("\n" + "="*70)
        logger.info("RUNNING: GUVNL ELECTRICITY")
        logger.info("="*70)
        rpa = GUVNLElectricityRPA(headless=False)
        result = rpa.fill_name_change_form(form_data)
        self.results.append(result)
        return result
    
    def run_amc_water(self, form_data):
        """Run AMC Water automation"""
        logger.info("\n" + "="*70)
        logger.info("RUNNING: AMC WATER")
        logger.info("="*70)
        rpa = AMCWaterRPA(headless=False)
        result = rpa.fill_name_change_form(form_data)
        self.results.append(result)
        return result
    
    def run_anyror_property(self, form_data):
        """Run AnyROR Property automation"""
        logger.info("\n" + "="*70)
        logger.info("RUNNING: ANYROR PROPERTY")
        logger.info("="*70)
        rpa = AnyRORPropertyRPA(headless=False)
        result = rpa.fill_name_transfer_form(form_data)
        self.results.append(result)
        return result
    
    def run_gujarat_gas(self, form_data):
        """Run Gujarat Gas automation"""
        logger.info("\n" + "="*70)
        logger.info("RUNNING: GUJARAT GAS")
        logger.info("="*70)
        rpa = GujaratGasRPA(headless=False)
        result = rpa.fill_name_change_form(form_data)
        self.results.append(result)
        return result
    
    def print_summary(self):
        """Print summary of all results"""
        logger.info("\n" + "="*70)
        logger.info("SUMMARY OF ALL AUTOMATIONS")
        logger.info("="*70)
        
        for i, result in enumerate(self.results, 1):
            status = "✓ SUCCESS" if result['status'] == 'success' else "✗ FAILED"
            portal = result.get('portal', 'Unknown')
            logger.info(f"{i}. {portal}: {status}")
            if result['status'] == 'error':
                logger.info(f"   Error: {result['message']}")
        
        logger.info("="*70)

if __name__ == "__main__":
    master = RPA_Master()
    
    # Common form data
    common_data = {
        'old_name': 'Rajesh Kumar',
        'new_name': 'Rajesh Kumar Singh',
        'mobile': '9876543210',
        'email': 'rajesh@example.com'
    }
    
    # Torrent Power
    tp_data = {**common_data, 'service_number': 'TP123456789'}
    master.run_torrent_power(tp_data)
    
    # Adani Gas
    ag_data = {**common_data, 'consumer_number': 'AG123456789'}
    master.run_adani_gas(ag_data)
    
    # GUVNL Electricity
    guvnl_data = {**common_data, 'service_number': 'TP123456789', 'distribution': 'PGVCL'}
    master.run_guvnl_electricity(guvnl_data)
    
    # AMC Water
    amc_data = {**common_data, 'connection_id': 'AMC123456', 'ward': 'Ward 1'}
    master.run_amc_water(amc_data)
    
    # AnyROR Property
    anyror_data = {**common_data, 'survey_number': '123/1/A', 'district': 'Ahmedabad', 'taluka': 'Ahmedabad City'}
    master.run_anyror_property(anyror_data)
    
    # Gujarat Gas
    gg_data = {**common_data, 'consumer_number': 'GG123456789'}
    master.run_gujarat_gas(gg_data)
    
    # Print summary
    master.print_summary()
