"""
Test script to verify the basic structure and database functionality
without requiring the full GUI to run.
"""

import os
import sys
import sqlite3
from datetime import date, timedelta

# Add the current directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_database_structure():
    """Test the database schema and basic operations."""
    print("Testing database structure...")
    
    # Import the database functions
    try:
        from production_pm_tracker import (
            get_db_path, init_database, DatabaseManager
        )
        print("[OK] Successfully imported database functions")
    except ImportError as e:
        print(f"[FAIL] Failed to import: {e}")
        return False
    
    # Initialize database
    try:
        init_database()
        print("[OK] Database initialized successfully")
    except Exception as e:
        print(f"[FAIL] Database initialization failed: {e}")
        return False
    
    # Test database file creation
    db_path = get_db_path()
    if os.path.exists(db_path):
        print(f"[OK] Database file created at: {db_path}")
    else:
        print(f"[FAIL] Database file not found at: {db_path}")
        return False
    
    # Test adding a machine
    try:
        success = DatabaseManager.add_machine("Test Machine 1")
        if success:
            print("[OK] Successfully added test machine")
        else:
            print("[FAIL] Failed to add test machine (may already exist)")
    except Exception as e:
        print(f"[FAIL] Error adding machine: {e}")
        return False
    
    # Test adding components
    try:
        component_data = {
            'component_name': 'Test Component',
            'pm_interval_days': 30,
            'alert_threshold_days': 5,
            'last_performed_date': date.today().isoformat()
        }
        success = DatabaseManager.add_component("Test Machine 1", component_data)
        if success:
            print("[OK] Successfully added test component")
        else:
            print("[FAIL] Failed to add test component")
    except Exception as e:
        print(f"[FAIL] Error adding component: {e}")
        return False
    
    # Test retrieving machines
    try:
        machines = DatabaseManager.get_all_machines()
        if machines:
            print(f"[OK] Successfully retrieved {len(machines)} machine(s)")
            for machine in machines:
                print(f"  - Machine: {machine['name']}")
                for component in machine.get('components', []):
                    print(f"    - Component: {component['component_name']}, Days remaining: {component.get('days_remaining', 0)}")
        else:
            print("[FAIL] No machines retrieved")
    except Exception as e:
        print(f"[FAIL] Error retrieving machines: {e}")
        return False
    
    # Test component reset
    try:
        machines = DatabaseManager.get_all_machines()
        if machines and machines[0].get('components'):
            component_id = machines[0]['components'][0]['id']
            success = DatabaseManager.reset_component(component_id)
            if success:
                print("[OK] Successfully reset test component")
            else:
                print("[FAIL] Failed to reset test component")
        else:
            print("[SKIP] No components to test reset")
    except Exception as e:
        print(f"[FAIL] Error resetting component: {e}")
        return False
    
    # Test days remaining calculation
    try:
        # Test overdue
        overdue_date = (date.today() - timedelta(days=10)).isoformat()
        days = DatabaseManager.calculate_days_remaining(overdue_date)
        if days == 0:
            print("[OK] Overdue calculation correct (0 days)")
        else:
            print(f"[FAIL] Overdue calculation incorrect: {days} days")
        
        # Test future
        future_date = (date.today() + timedelta(days=10)).isoformat()
        days = DatabaseManager.calculate_days_remaining(future_date)
        if days == 10:
            print("[OK] Future calculation correct (10 days)")
        else:
            print(f"[FAIL] Future calculation incorrect: {days} days")
    except Exception as e:
        print(f"[FAIL] Error testing days calculation: {e}")
    
    return True

def test_email_config():
    """Test email configuration functions."""
    print("\nTesting email configuration...")
    
    try:
        from production_pm_tracker import EmailConfig
        print("[OK] Successfully imported email configuration functions")
    except ImportError as e:
        print(f"[FAIL] Failed to import: {e}")
        return False
    
    # Test loading default config
    try:
        config = EmailConfig.load_config()
        if config:
            print("[OK] Successfully loaded email configuration")
            print(f"  - Enabled: {config.get('enabled', False)}")
            print(f"  - SMTP Host: {config.get('smtp_host', 'N/A')}")
        else:
            print("[FAIL] Failed to load email configuration")
    except Exception as e:
        print(f"[FAIL] Error loading email config: {e}")
        return False
    
    return True

def test_theme_constants():
    """Test that theme constants are defined."""
    print("\nTesting theme constants...")
    
    try:
        from production_pm_tracker import Theme
        print("[OK] Successfully imported Theme class")
        
        # Check for essential colors
        colors = ['BG_PRIMARY', 'BG_CARD', 'TEXT_PRIMARY', 'PRIMARY', 'GREEN', 'YELLOW', 'RED']
        for color in colors:
            if hasattr(Theme, color):
                print(f"[OK] Theme.{color} defined")
            else:
                print(f"[FAIL] Theme.{color} not defined")
                return False
        
    except ImportError as e:
        print(f"[FAIL] Failed to import Theme: {e}")
        return False
    
    return True

def main():
    """Run all tests."""
    print("=" * 50)
    print("Production PM Tracker - Structure Tests")
    print("=" * 50)
    
    results = []
    
    # Run tests
    results.append(("Theme Constants", test_theme_constants()))
    results.append(("Database Structure", test_database_structure()))
    results.append(("Email Configuration", test_email_config()))
    
    # Print summary
    print("\n" + "=" * 50)
    print("Test Summary")
    print("=" * 50)
    
    passed = 0
    failed = 0
    
    for test_name, result in results:
        status = "PASSED" if result else "FAILED"
        symbol = "[OK]" if result else "[FAIL]"
        print(f"{symbol} {test_name}: {status}")
        
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("\n[OK] All tests passed! The basic structure is working correctly.")
        print("\nTo run the full application, install PySide6 and run:")
        print("  py -m pip install -r requirements.txt")
        print("  py production_pm_tracker.py")
    else:
        print(f"\n✗ {failed} test(s) failed. Please check the errors above.")

if __name__ == "__main__":
    main()