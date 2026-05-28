# Production PM Tracker

A manufacturing Preventive Maintenance (PM) tracker application built with PySide6.

## Features

- **Multi-component tracking**: Track up to 5 components per machine
- **Background email notifications**: Automatic alerts when maintenance is due
- **System tray integration**: Minimize to tray and run in background
- **Dark theme interface**: Modern industrial aesthetic
- **Dynamic health monitoring**: Color-coded progress bars (green/yellow/red)
- **Isolated PM resets**: Reset individual components without affecting others
- **SQLite database**: Local data storage
- **Email configuration**: Customizable SMTP settings

## Installation

1. **Install Python 3.8 or higher** (if not already installed)

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

   Or manually install PySide6:
   ```bash
   pip install PySide6
   ```

## Usage

1. **Run the application**:
   ```bash
   python production_pm_tracker.py
   ```

2. **Add Equipment**:
   - Click the "+ Add Equipment" button
   - Enter equipment name
   - Add components (up to 5)
   - Set maintenance intervals and alert thresholds
   - Click "Save"

3. **Reset Maintenance**:
   - Click the reset button (↻) on any component
   - Confirm the reset
   - The component's last performed date will be set to today

4. **Configure Email**:
   - Click the "⚙ Email" button
   - Enter SMTP settings
   - Enable notifications
   - The system will send hourly alerts for components due soon

5. **System Tray**:
   - Close the window to minimize to system tray
   - Double-click the tray icon to restore
   - Right-click for menu options

## Database

The application uses SQLite for data storage:
- `production_pm_tracker.db` - Main database file
- `email_config.json` - Email configuration file

Both files are created in the same directory as the application.

## Health Status Colors

- **Green**: Safe operating window
- **Yellow**: Approaching alert threshold
- **Red**: Overdue or crossed alert threshold

## Version

- Version: 1.0
- Made by Sankar

## Dependencies

- Python 3.8+
- PySide6 6.6.0

## License

Internal use for Ichor Systems