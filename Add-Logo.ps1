# Create a placeholder logo and add it to the repository

# First, let's create a simple text-based logo file
@"
                                                 
   _____                           _____ _       _     _   
  / ____|                         / ____(_)     | |   | |  
 | (_____      ____ _ _ __ _ __ | (___  _  __ _| |__ | |_ 
  \___ \ \ /\ / / _` | '__| '_ \ \___ \| |/ _` | '_ \| __|
  ____) \ V  V / (_| | |  | | | |____) | | (_| | | | | |_ 
 |_____/ \_/\_/ \__,_|_|  |_| |_|_____/|_|\__, |_| |_|\__|
                                           __/ |          
                                          |___/           
"@ | Out-File -FilePath "c:\Users\Admin\Desktop\memora\Chain-Fox-main\logo.txt" -Encoding utf8

# Add the logo to Git and commit
cd "c:\Users\Admin\Desktop\memora\Chain-Fox-main"
git add logo.txt
git commit -m "Add SwarmSight logo" -m "Add text-based logo for the SwarmSight project"

# Push to GitHub
git push -u origin main

Write-Host "Logo added and pushed to GitHub." -ForegroundColor Green
