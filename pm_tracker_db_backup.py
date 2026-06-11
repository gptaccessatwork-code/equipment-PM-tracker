import os
import shutil
from datetime import datetime

SOURCE = r'S:\Engineering\Equipment PM Tracker\production_pm_tracker.db'
DEST_DIR = r'C:\Users\kmageshkumar\OneDrive - Ichor Systems\Backups\Equipment PM Tracker'
MAX_BACKUPS = 30

def run_backup():
    # 1. Create the new backup with a timestamp
    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    dest_file = os.path.join(DEST_DIR, f"backup_{timestamp}.db")
    shutil.copy2(SOURCE, dest_file)
    
    # 2. Get list of existing backups sorted by modification time
    files = [os.path.join(DEST_DIR, f) for f in os.listdir(DEST_DIR) if f.endswith('.db')]
    files.sort(key=os.path.getmtime)
    
    # 3. Delete oldest if we exceed the limit
    while len(files) > MAX_BACKUPS:
        oldest_file = files.pop(0)
        os.remove(oldest_file)
        print(f"Deleted old backup: {oldest_file}")

if __name__ == "__main__":
    run_backup()