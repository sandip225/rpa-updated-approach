"""
Service Data Loader
Loads all services from JSON file
"""
import json
import os
from typing import Dict, List, Any

class ServiceLoader:
    def __init__(self):
        self.data_file = os.path.join(os.path.dirname(__file__), 'services_data.json')
        self.services = self._load_services()
    
    def _load_services(self) -> Dict[str, List[Dict[str, Any]]]:
        """Load services from JSON file"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading services: {e}")
            return {}
    
    def get_all_services(self) -> Dict[str, List[Dict[str, Any]]]:
        """Get all services"""
        return self.services
    
    def get_services_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get services by category (gas, electricity, water, property)"""
        return self.services.get(category, [])
    
    def get_service_by_id(self, category: str, service_id: str) -> Dict[str, Any]:
        """Get specific service by ID"""
        services = self.services.get(category, [])
        for service in services:
            if service['id'] == service_id:
                return service
        return {}
    
    def get_online_services(self, category: str) -> List[Dict[str, Any]]:
        """Get only online available services"""
        services = self.services.get(category, [])
        return [s for s in services if s.get('online_available', False)]
    
    def get_rpa_enabled_services(self, category: str) -> List[Dict[str, Any]]:
        """Get only RPA enabled services"""
        services = self.services.get(category, [])
        return [s for s in services if s.get('rpa_enabled', False)]
    
    def get_service_names(self, category: str) -> List[str]:
        """Get list of service names for a category"""
        services = self.services.get(category, [])
        return [s['name'] for s in services]
    
    def get_service_by_name(self, category: str, name: str) -> Dict[str, Any]:
        """Get service by name"""
        services = self.services.get(category, [])
        for service in services:
            if service['name'].lower() == name.lower():
                return service
        return {}

# Global instance
_loader = None

def get_service_loader() -> ServiceLoader:
    """Get or create service loader instance"""
    global _loader
    if _loader is None:
        _loader = ServiceLoader()
    return _loader

# Test
if __name__ == "__main__":
    loader = get_service_loader()
    
    print("All Gas Services:")
    for service in loader.get_services_by_category('gas'):
        print(f"  - {service['name']} ({service['type']})")
    
    print("\nOnline Electricity Services:")
    for service in loader.get_online_services('electricity'):
        print(f"  - {service['name']}")
    
    print("\nRPA Enabled Services:")
    for category in ['gas', 'electricity', 'water', 'property']:
        rpa_services = loader.get_rpa_enabled_services(category)
        if rpa_services:
            print(f"\n{category.upper()}:")
            for service in rpa_services:
                print(f"  - {service['name']}")
