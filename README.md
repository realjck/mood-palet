# 🎨 Mood Palet

This application allows the user to automatically generate a palette of five colors from an input picture. It then allows users to save and manage their palettes, as well as share them publicly on the web.

### Features

- Upon application startup at the root path (./), the database is initialized using the schema.sql script.


- User accounts can be created and accessed using existing credentials.


- Publicly accessible palets collection page for users.


- Each palette has a unique, shareable 8-character URL.


- Logged-in users can delete self-created palets through a "Delete palet" button on the palet page.


- A static navigation bar provides options for user logout and returning to the personal page.

### Python 3 | Flask

### Setup Python environment:

```bash
# Create virtual environment:
python3 -m venv .venv

# Activate Python (Mac/Linux):
.venv/bin/activate
# (Windows PowerShell):
.venv/Scripts/activate

# Install dependencies:
pip install -r requirements.txt
```

### Launch app:

```bash
# Launch (--debug for quick refresh):
flask --app main run --debug
```

---

_Happy palet creation!_
