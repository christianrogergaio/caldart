import base64
import os

png_data = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")

assets_dir = "mobile_app/assets"
os.makedirs(assets_dir, exist_ok=True)

files = ["icon.png", "splash.png", "adaptive-icon.png", "favicon.png"]

for f in files:
    path = os.path.join(assets_dir, f)
    with open(path, "wb") as file:
        file.write(png_data)
    print(f"Created {path}")
