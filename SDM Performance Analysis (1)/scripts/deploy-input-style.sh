#!/bin/bash
cd /vercel/share/v0-project
git add -A
git commit -m "Enhance input fields styling with better background and border contrast

- Add bg-input/50 for visible background on all input fields
- Change to border-2 border-primary/60 for thicker cyan borders
- Improve focus state with border-primary and cyan glow effect
- Apply consistent styling across Nama, Departemen, and Posisi fields
- Enhanced visual hierarchy and futuristic appearance"
git push origin HEAD
vercel --prod --yes
