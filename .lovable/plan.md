## Plan

1. **Make the Settings tab self-healing**
   - Add a local list of required homepage setting keys in `AdminPage.tsx`.
   - When admin settings load, merge database rows with these required defaults so the homepage stat/company fields always appear even if the database query returns only older settings.

2. **Show the new fields clearly in Admin → Settings**
   - Add the missing editable options:
     - Alumni count
     - Countries count
     - Companies count
     - Years strong
     - Hero joined count
     - Hero worldwide companies
     - Homepage companies list
   - Use a larger textarea-style control for the comma-separated companies list so it’s easier to edit.

3. **Keep saving through the existing secure backend function**
   - Leave `handleSaveSetting` using `update-site-settings`.
   - After save, refresh settings so new rows/values stay in sync.

4. **Verify the UI behavior**
   - Confirm the Settings tab displays all expected settings and does not show “No settings available.”