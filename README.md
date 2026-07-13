# SNDL & ELF
## What is SNDL, and Why did I create this?
This is repository for SNDL, a biomimetic robot that is your unique companion for your climate action :  When you pick up, SNDL carries! For this project, there is 2 sub-project -- hardware robot 'SNDL', and the app called ELF where you can follow navigation to collect waste in most efficient way together with SNDL, and calculate impact of your climate action through AI model I self-developed by emailing <mark>90+ national parks in U.S</mark>
I created this project for two reason.
1. 'Biomimetic robot' is the concept I have been researching for 3 years, and 'Mountain waste problem' is what i deeply resonate for especially because of my regional characteristic. By combining this two concept, together with application where we can collect waste together with robot, i believe i could get one step closer to the future where technology solves environment's problem.
2. This is project i created irl to qualify for <mark> hack club fallout (YSWS program in shenzhen)</mark>. I always wanted to meet builders from all over the world, and fallout was my first ysws event in hack club. Despite it was my very first experience, by attending fallout, i got to be extremely interestd in hack club vision. Especially, the fact that how hackathons from hackclub gathered many passionate teenagers in diverse regions who "purely loves" building / programming / designing, and provides the chance to collaborate with all those people got me really into fallout. Here are some photos of me attending fallout:)
 <img width="1014" height="654" alt="image" src="https://github.com/user-attachments/assets/5a30507b-cbc1-4ca0-b85b-e4acb80daa04" />


## About this Project

SNDL,a mountain waste collecting beetle-like 6-legged biomimetic robot companion, with app ELF, builds a sustainable future through protecting nature closest to our daily life. 

Can you believe everyday trash on mountains causes biodiversity loss, water contamination, and economic loss of $16M per 100t? Trash is piling up every second – 2,200tons in Yosemite – as rugged terrain limits humans to collect 4% of total trash. 

SNDL revolutionize this reality through first-ever innovation inspired by insects’ skeletal structures evolved to survive in mountains. Built over believing “nature already holds the answer to our problem”, SNDL targets to remove all the accumulated trash through collaboration with human. No need to carry heavy wastes and get exhausted over exhausted: you can just hand them in to SNDL and it’ll carry it for you!

By mimicking the Diabolical Ironclad Beetle and the Metallifer Stag Beetle, SNDL plan to restore one mountain ecosystem — one BIOME — proving we aren’t late to save this planet.

## Zine page
<img width="1410" height="2000" alt="Approval Hours Deadline June 27" src="https://github.com/user-attachments/assets/4745271f-4311-4142-b6b6-27ddd89ec3c2" />

# The technical explanation for ELF (app used together with SNDL)
ELF is supporting application for your journey to collect waste with SNDL. By using it, you can report the waste, where the vision AI will analyze the waste and automatically calculate your impact to nature regarding saved plants and animals. Specifically, I created impact constant for each type of waste through emailing 90 national parks in U.S & researching volunteering reports, and self-developed 
Additionally, it has a waste navigation feature, where it will guide you to collect waste in most efficient way via generating route from reported waste spot. Finally, this app 'ELF' leads your journey of climate action with SNDL active and sustainable through virtual biome that gets cleaner and cleaner proportional to your climate activity. 
<img width="731" height="397" alt="Screenshot 2026-07-14 at 1 17 51 AM" src="https://github.com/user-attachments/assets/08aa88d5-6015-4747-842e-09ed2d4bc0c9" />

Currently, I am building feature where ELF enables user to control SNDL and will continuosly update this project. 

# The technical explanation & Guide for hardware robot SNDL

## Build Guide
1. See assembly body.f3z / .step and understand how each parts are attched to other
2. Print body, and 2 Exoskeleton.step. Attach only 1 exoskeleton to the body using M3 screws and nut.
3. Print 6 body-femur motor bracket and attach them to the body using M3 screw.
4. Print 12 femur-tibia bearings (bearing.step) and attach each other by M3 screws.
5. Print 6 femur and 6 tibia.
6. Attach motors to the 18 motor bracket inside the printed part by M3 screw.
7. Attach femur & tibia to bearings using M4 bearing and M2.5 screws. 

## BOM
The key parts that are critical, and should be rigidly remain in the design even if you make some changes are: 
-2 PCA boards
-1 ESP Devkit V4
-18 MG90S motors
-20A DC-DC & 2A Dual Buck converter system
-15A & 3A Dual buck system
Furthermore, I used M3 & M2 screws and nuts to rigidly join parts, while using M4 bearings for the leg joints. You can check out the details in BOM (Bill of Materials for SNDL).csv file and get the materials as the links are attached, and follow the schematics.pdf file! Soldering is fine, but I recommend using wago connectors at the beginning since theres high chance motor might burn for beginners. 

## Key CAD file
<img width="898" height="796" alt="image" src="https://github.com/user-attachments/assets/c017f482-18e5-4c8b-baf2-b75505830295" />
The most important design choice I made was to mimic Diabolical Ironclad beetle's exoskeleton into the robot's main frame, so that it can carry a load of waste at once and be perfect companion for your waste-collecting journey. Specifically, diabolical ironclad beetle can endure 4900x of its body weight because of its suture! As shown in assembly body.f3z / .step file, this exoskeleton is covered by shell, where body-coxa bracket, bearing bracket, femur and tibia are attached. 
Furthermore, regarding the leg joint, I used three motor for each femur, tibia, body-femur joints together with M4 bearing. This was to create stable gait as SNDL will be walking on mountain at future. 

## Schematics
<img width="1458" height="1444" alt="image" src="https://github.com/user-attachments/assets/62ab1243-b989-4798-a1d1-5065458d1f3b" />
The key for this schematic is 20A DC-DC & 2A Dual Buck converter system, 2 PCA 9685 with ESP 32 for systemized motor control, 4700uF capacitor to reduce risk with 5A and 15A fuse, as well as 14.8V 4ps fof 18650 3.7V battery. 
## Firmware
The firmware has inverse kinematics & tripod gait feature.
You can connect your nintendo joycon or any other controller bluepad32 supports! My advise would be to set zero points of each leg joints' servo motor before operating the code, to reduce any risks. 

## Current status of the project & How I feel
For now, SNDL is built in real life, and is capable of standing & controlling leg one by one. Currently, I am working on additional firmware to ELF where the SNDL will be walking by tripod gait soon. This was my first time controlling "18" motors all at once (MG90S) with use of inverse kinematics, along the fantastic combination of PCA9685 and ESP32. I am happy that the leg could be controlled one by one, but due to risk of voltage shortage extra power should be supplied on ESP in order for SNDL to succesfully work, which are being proceeded. 
<img width="648" height="510" alt="image" src="https://github.com/user-attachments/assets/42f25f23-4353-422d-8615-7f70c1faa318" />

