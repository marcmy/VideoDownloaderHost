import sys
import requests
from tqdm import tqdm

url, referer, user_agent, out_path = sys.argv[1:5]

headers = {
    "Referer": referer,
    "User-Agent": user_agent
}

with requests.get(url, headers=headers, stream=True) as r:
    r.raise_for_status()
    total = int(r.headers.get('content-length', 0))
    with open(out_path, 'wb') as f, tqdm(
        total=total, unit='B', unit_scale=True, desc="Downloading", ncols=80
    ) as bar:
        for chunk in r.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
                bar.update(len(chunk))

print(f"\nSaved to: {out_path}")
input("Press Enter to close...")
