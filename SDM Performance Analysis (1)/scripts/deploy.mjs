import { execSync } from 'child_process';
import path from 'path';

const projectDir = '/vercel/share/v0-project';

try {
  console.log('Starting deployment process...\n');
  
  // Add all files
  console.log('1. Running: git add -A');
  execSync('git add -A', { cwd: projectDir, stdio: 'inherit' });
  
  // Commit changes
  console.log('\n2. Running: git commit');
  const commitMsg = `Enhance input fields styling with better background and border contrast

- Add bg-input/50 for visible background on all input fields
- Change border to border-2 border-primary/60 for thick cyan border
- Improve focus state with enhanced glow effect
- Apply consistent styling across all form inputs`;
  
  execSync(`git commit -m "${commitMsg}"`, { cwd: projectDir, stdio: 'inherit' });
  
  // Push to origin
  console.log('\n3. Running: git push origin HEAD');
  execSync('git push origin HEAD', { cwd: projectDir, stdio: 'inherit' });
  
  // Deploy to Vercel
  console.log('\n4. Running: vercel --prod --yes');
  execSync('vercel --prod --yes', { cwd: projectDir, stdio: 'inherit' });
  
  console.log('\n✓ Deployment completed successfully!');
} catch (error) {
  console.error('✗ Deployment failed:', error.message);
  process.exit(1);
}
