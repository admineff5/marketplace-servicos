import urllib.request, json, zipfile, os

try:
    url = "https://open-vsx.org/api/anderson-memory-tech/ide-memory-system-anderson"
    data = json.loads(urllib.request.urlopen(url).read())
    
    files = data.get("files", {})
    download_url = files.get("download")
    
    if download_url:
        print(f"Downloading from: {download_url}")
        dest_zip = r"c:\Antigravity\tmp\extension.vsix"
        urllib.request.urlretrieve(download_url, dest_zip)
        print("Downloaded .vsix successfully!")
        
        extract_dir = r"c:\Antigravity\tmp\extension_extracted"
        with zipfile.ZipFile(dest_zip, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
        print("Extracted .vsix successfully!")
        
        # List files to see if the script is inside
        with open(r"c:\Antigravity\tmp\extracted_files.txt", "w") as f:
            for root, dirs, filenames in os.walk(extract_dir):
                for filename in filenames:
                    f.write(os.path.join(root, filename) + "\n")
        print("File names saved to extracted_files.txt")
    else:
        print("No download URL found.")

except Exception as e:
    print("Error:", str(e))
