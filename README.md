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

### Launch app for dev:

```bash
# Launch (--debug for quick refresh):
flask --app main run --debug
```

### Launch app with Docker:

This version is containerized with Docker using SSL certificates from the deployment server, which must be linked in the Dockerfile.

```bash
# build
docker build -t mood-palet .

# launch
docker run --restart always -d -p 443:80 mood-palet
```

### Features roadmap (todo):

- [ ] Outsources the Docker container database to ensure the persistence of data

- [ ] Home page with palettes created by all users

- [ ] Adds navbar for visitors to all pages with access to the home page

- [ ] Review the color algorithm for better results for photographs

- [ ] Click on the palettes to access their page, instead of the link button

- [ ] Removal of the generate button and display of palettes directly when uploading the photo

- [ ] Adaptation of the UI for smartphones with addition of a share button on palette pages and addition of hexadecimal codes that can be copied by clicking
