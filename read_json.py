import json
import sys

DEFAULT_PATH = "aduana_enlaces/scraper_aduana.json"

def main(path=DEFAULT_PATH):
    """Load JSON data from the given path and print a summary."""
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"Loaded {len(data)} entries from {path}")
    for item in data[:3]:
        print("URL:", item.get("url"))
        print("Título:", item.get("titulo"))
        print()

if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_PATH
    main(path)
