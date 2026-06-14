import os
import re

workspace_dir = r"d:\wave and zen\wave&zen"

pattern = re.compile(
    r'<p class="footer-tagline">Ride the wave\. Find your zen\. Experience the coast in its most authentic form\.</p>',
    re.IGNORECASE
)

replacement = """<p class="footer-tagline">
        <span class="tagline-main">Ride the wave. Find your zen. Experience the coast in its most authentic form.</span>
        <span class="tagline-sub">Our premium surf coaching and beach yoga retreats are designed to refresh your body, calm your mind, and reconnect your soul with the ocean.</span>
        <span class="tagline-extra">Chase the horizon. Embrace the breeze. Discover coastal beauty at its purest.</span>
      </p>"""

for root, dirs, files in os.walk(workspace_dir):
    for file in files:
        if file.endswith(".html"):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                if pattern.search(content):
                    updated_content = pattern.sub(replacement, content)
                    with open(file_path, "w", encoding="utf-8", newline="") as f:
                        f.write(updated_content)
                    print(f"Successfully updated: {file}")
                else:
                    print(f"Pattern not found in: {file}")
            except Exception as e:
                print(f"Error processing {file}: {e}")
