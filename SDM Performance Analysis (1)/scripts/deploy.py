import subprocess
import os

os.chdir('/vercel/share/v0-project')

# Add all changes
subprocess.run(['git', 'add', '-A'], check=True)

# Commit changes
commit_message = """Enhance input fields styling with better background and border contrast

- Add bg-input/50 for visible background on all input fields
- Change to border-2 border-primary/60 for thicker cyan borders
- Improve focus state with border-primary and cyan glow effect
- Apply consistent styling across Nama, Departemen, and Posisi fields
- Enhanced visual hierarchy and futuristic appearance"""

subprocess.run(['git', 'commit', '-m', commit_message], check=True)

# Push to origin
subprocess.run(['git', 'push', 'origin', 'HEAD'], check=True)

# Deploy to Vercel
subprocess.run(['vercel', '--prod', '--yes'], check=True)

print("[v0] Deployment completed successfully!")
