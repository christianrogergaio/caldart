import os
import re
import requests

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static', 'vendor')

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

# 1. Handle Google Fonts (Inter & Material)
def process_css_fonts(css_filename, font_subfolder):
    css_path = os.path.join(STATIC_DIR, 'css', css_filename)
    font_dir = os.path.join(STATIC_DIR, 'fonts', font_subfolder)
    ensure_dir(font_dir)
    
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find URLs
    # src: url(https://...)
    urls = set(re.findall(r'url\((https?://[^)]+)\)', content))
    
    new_content = content
    print(f"Processing {css_filename} - Found {len(urls)} unique fonts.")
    
    for i, url in enumerate(urls):
        ext = url.split('.')[-1]
        filename = f"{font_subfolder}-{i}.{ext}"
        local_path = os.path.join(font_dir, filename)
        
        # Download
        print(f"Downloading {url} to {filename}...")
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                with open(local_path, 'wb') as f_out:
                    f_out.write(resp.content)
                
                # Replace in CSS
                # relative path from css/file.css to fonts/subfolder/file.ttf is ../fonts/subfolder/file.ttf
                relative_path = f"../fonts/{font_subfolder}/{filename}"
                new_content = new_content.replace(url, relative_path)
            else:
                print(f"Failed to download {url}: Status {resp.status_code}")
        except Exception as e:
            print(f"Error downloading {url}: {e}")
            
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {css_filename}")

# 2. Handle FontAwesome (Known URLs match CDN structure)
def download_fontawesome():
    webfonts_dir = os.path.join(STATIC_DIR, 'webfonts')
    ensure_dir(webfonts_dir)
    
    # Common FA 6.4.0 files referenced in all.min.css
    base_url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts"
    files = [
        "fa-brands-400.woff2", "fa-brands-400.ttf",
        "fa-regular-400.woff2", "fa-regular-400.ttf",
        "fa-solid-900.woff2", "fa-solid-900.ttf",
        "fa-v4compatibility.woff2", "fa-v4compatibility.ttf"
    ]
    
    print("Downloading FontAwesome Webfonts...")
    for filename in files:
        url = f"{base_url}/{filename}"
        local_path = os.path.join(webfonts_dir, filename)
        
        print(f"Downloading {filename}...")
        try:
            resp = requests.get(url, timeout=10)
            if resp.status_code == 200:
                with open(local_path, 'wb') as f_out:
                    f_out.write(resp.content)
            else:
                print(f"Failed {filename}: {resp.status_code}")
        except Exception as e:
            print(f"Error {filename}: {e}")

if __name__ == "__main__":
    process_css_fonts("inter.css", "inter")
    process_css_fonts("material-symbols.css", "material")
    download_fontawesome()
    print("Done.")
