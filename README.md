# Mood Palet

This application allows the user to automatically generate three different colors from an input color, to be able, for example, to find the best match for clothing or to create a graphic composition.

It then allows users to save and manage their palettes, tag them by mood, as well as share them publicly on the web.

### Python 3 | Flask

```bash
python3 -m venv .venv
source venv/bin/activate
# windows: "source .venv/Scripts/activate"
pip install -r requirements.txt

flask --app main run --debug
# (--debug for quick refresh)
```
