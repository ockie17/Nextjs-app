#!/bin/bash
cd /vercel/share/v0-project
pnpm build
git add -A
git commit -m "Enhance input fields with contrasting background and border

- Add bg-input/50 background color to all inputs
- Change border to border-2 with primary/60 color for more visibility
- Improve focus state with primary border and cyan glow shadow
- Better visual hierarchy for form fields in card"
git push origin HEAD
vercel --prod --yes
