# SNDL — Journal Export

- Exported at: 2026-06-26T01:56:06Z
- Project ID: 986
- Entries: 12

## Entry 1
- ID: 14663
- Author: happysunhoo
- Created At: 2026-06-17T01:34:13Z

### Content

![Screenshot 2026-06-10 at 12.38.45 PM.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzQ0NzIsInB1ciI6ImJsb2JfaWQifX0=--fd75d5c9f4ad31a10267de21d7a3b88ea716768c/Screenshot 2026-06-10 at 12.38.45 PM.png)

## Basic Description

**Motor:** 16 motors.

- 12 motors were for the leg  — I originally planned to use 2 motors for each leg, while operating the knee joint through building the 4 bar linkage system in the femur.
    - The reason that I strongly thought using 2 motors will be the best option is because I considered “What would be the next step after I complete this project?”. I want BIOME to be actually collecting waste from the mountain globally. To do this, the mass production cost needed to be low, and energy efficiency of the robot had to be high: which could be achieved if robot operates by 2 motors per leg.
    
![imagess.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzQ0NzMsInB1ciI6ImJsb2JfaWQifX0=--60128a3cd34ccd71bb28128379b91094c1ebeae2/imagess.png)
   
 
    - The big question for this choice would be if the 2 motors per leg is enough to hold both robot’s body and the waste it will be carrying, as well as if it is enough to survive the mountain’s steep, complex terrain.
- 4 motors were for the arm, since I planned to build 4 DOF robotic arm in order to collect the waste.

**PCA9685 & ESP32:** 1 PCA board in order to manage the 16 motors. With ESP32, this is a strong combination of motor management system. 

**Buck module:** 20A DC-DC stepdown converter used, together with 2 10K resistors. 

**Battery:** 4 ps of 18650 Li-on battery, which supplies 14.8V to the system. 



## Journal

**General Overview:** I spent 2 hours and a half for this schematic diagram. The structure is very basic, and I attempted to do my best on connecting the parts I bought (MG90S motors, PCA9685 etc.) As this was my first time to even draw a schematic diagram, I started from the bottom — learning how to import the parts from the library, and how to rotate / move the items. Basically, I didn’t know what I was doing, and I simply focused on one keyword: “connect”.

**What went well:** However, I am still proud of how I took my first step on real ‘design’ level in this project after spending long time deciding which product I will use and measuring the parts. Schematic diagram is the start point of determining where I would place each parts, and how many jumper lines will get through in between 3d printed parts. 

**What to improve:** Despite this, I need to really take deep look at the diagram and determine if there are possibility of major problems to occur; it will be real disaster if I just follow the diagram without deep thinking and burn / ruin the 3d robot parts I will be printing. For instance, I need to check if the parts will operate stably both during the start and operating process. Regarding hardware, I also need to check if 12 motors in total for legs are enough to carry the 3d printed body. This would be done by calculating and summing up the torque. 



### Recording Links

- https://www.youtube.com/watch?v=Txue6fPUwyQ

## Entry 2
- ID: 15718
- Author: happysunhoo
- Created At: 2026-06-20T18:59:33Z

### Content

# Designing the body-coxa bracket, femur, tibia, and body shell
## Leg design choice
I changed my mind from 2 motor per leg using 4 bar linkage to 3 motor per leg, which would be further explained in second schematic journal. 
## Design process

### The first bracket design

A strong, stable bracket that connects the body and motor for the coxa was the starting point of leg designing process. For the very first bracket design, I mainly considered two core design points responding to the design inquiry. 

1. **How should the connecting surface for the bracket look like? :** Due to the unique exoskeleton design, the angle of the body shell’s side surface is different for each left and right. 
    
   
    
    Therefore, I used the measurement feature in fusion 360 in order to get the exact angle value of two different side surfaces. Then, using the sketch & extrude feature, I designed a bracket that exactly fits to the body.
    
    Regarding the size of the surface that connects to the body, it was important that the height of the right triangle formed in the side view exactly matched height of MG90s motors between the floor of the motor and wing. Furthermore, the surface area should be enough to make 4 M3 screws’ holes, in order to achieve rigid joints. 
    
2. **How should I insert the motor to the bracket?** : The thickness of surrounding outlines around the motor, and the method of inserting the motor during the building process was important.  
    
    Initially, I formed rectangular hole where I could insert the motor for an efficient and simplistic design. In addition, I cut off half of the surface that supports bottom surface of motor to prevent overheating. 
    

### The Problem

I noticed the major problem of the first design, which was that it was impossible to insert the motor bracket in real life. Specifically, the jumper cable attached at the bottom of the motor was continuously stuck, despite motor was supposed to be inserted from top to bottom. 

### The Second bracket design

To solve this problem, I cut off 1.5mm 3-sided rectangular hole in addition to the hole for the motor, so that the motor could be inserted without jumper cable getting stuck. 

### The Second Problem

While now it became possible to insert the motors inside the bracket, there was total mismatch between the motor’s height and height of the bearing. Specifically, initial plan was that only the area between the bottom of motor’s wing and actual bottom are inserted to the bracket. However, I made mistake during the fusion design process where the actual height of the bracket is motor’s bottom to the wing’s top — not wing’s bottom — which makes entire bracket and bearing to not fit together off by 3mm. 

However, this problem couldn’t be solved just by shortening the height of the motor bracket for 3mm, as the M3 holes are already placed both in the bracket and the body. 

### The Third bracket design

Therefore, I changed the method of insertion from top to bottom —> left to right. I am very proud of this major change because while it was simple, it solved everything. It allowed sticking with the original dimension. 

### The final problem

The holes for M2 screws in bracket and the actual motor design was off by 2mm. While it was very frustrating that the design wouldn’t work because its just off by 2mm, I adjusted and reprinted, which gave the final design. 


Using the basic framework of bracket where I can easily insert the motor, I adjusted the design little bit and created 

- Femur, where the two brackets are opposing each other with the truss structure in center
- Tibia, where truss structure and sharp foot is used
- I also created robotic arm to prepare for second version of SNDL and discover difference between mecahnism of robotic arm and robotic leg. 
-Research in terms of the gecko's adhesive gripper were used to discover if the sharp foot was good design choice. 
-Started assemblying to check if M3 screw fit them well
![Scree1nshot 2026-06-20 at 12.46.35 PM.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1MjgsInB1ciI6ImJsb2JfaWQifX0=--9a40a763d5facb34941084f53ee283251b39340e/Scree1nshot 2026-06-20 at 12.46.35 PM.png)

![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1MjksInB1ciI6ImJsb2JfaWQifX0=--8d600cbd44fc9d451f3f5d82163ffaf070df0e69/image.png)


### Recording Links

- https://www.youtube.com/watch?v=m70l9kMx5_w
- https://www.youtube.com/watch?v=hZzoAoV_PaM
- https://www.youtube.com/watch?v=I2ZKuOwFTY0
- https://www.youtube.com/watch?v=1EjhAGLnzlM
- https://www.youtube.com/watch?v=pJdAX-2-UxE
- https://www.youtube.com/watch?v=OK66c3aXtEk
- https://www.youtube.com/watch?v=TpF8qAP3U2s
- https://www.youtube.com/watch?v=rnue8Mgdrns
- https://www.youtube.com/watch?v=tzxOGO-rfLI
- https://www.youtube.com/watch?v=KX4GzTnnX04
- https://www.youtube.com/watch?v=cioV2IIVYiU
- https://www.youtube.com/watch?v=r8CQ2yWal6E
- https://www.youtube.com/watch?v=isszw-ZLtZI
- https://www.youtube.com/watch?v=izmk6IEuOfI

## Entry 3
- ID: 15740
- Author: happysunhoo
- Created At: 2026-06-20T19:39:34Z

### Content

## Exoskeleton

I hypothesized that the skeletal characteristics of mountain-dwelling 'insects' are the most distinct and easily adaptable for robotic emulation. The decision to incorporate biomimicry into the robot's design stems from the fact that these biological structures have become highly optimized through evolutionary survival, aligning with our goal of developing a robot that harmonizes with nature. Ultimately,  I finalized the biomimetic robot design by replicating the **Diabolical Ironclad Beetle** and the **Metallifer Stag Beetle**.
**1) Diabolical Ironclad Beetle**
I first encountered the Diabolical Ironclad Beetle while reading the paper *"Toughening mechanisms of diabolical ironclad beetle"* published in the journal *Nature*. Its "exoskeleton" features a sutured structure capable of withstanding loads up to 39,000 times its own body weight (approximately 150 Newtons, with a displacement of 1 mm), which satisfies **a)**. Furthermore, the angle between the 'leg' joints, which minimizes the center of gravity and maximizes the range of motion, fulfills **b)**, while the 'feet' equipped with sharp protrusions satisfy **d)**.
**A. Exoskeleton**
The exoskeleton achieves highly efficient load distribution. This is because the sutures located at the upper center—where the wings originally emerged—and along the left and right sides form interlocking jigsaw puzzle-like structures, allowing mechanical stress to distribute uniformly throughout the entire body.
The ratio between the semi-major axis ($b$) and the semi-minor axis ($a$) follows the golden ratio of $1.8:1$. Additionally, three identical ellipses are interconnected at an angle of 25 degrees ($\theta$). These consistent parameters provide mechanical interlocking that prevents the delamination of the exoskeleton, simultaneously enhancing maximum tensile strength, shear stiffness, and fracture toughness. Consequently, I plan to directly apply these exact dimensions to the joint connections of the robot's main frame.
The initial hardware design completed in **Section C** above featured a fully solid, flat space between the outer and inner surfaces. While this provided structural stability, it revealed a significant drawback: it required an excessive amount of materials and capital. Therefore, I determined that the design needed refinement to minimize material consumption while maintaining stable stress distribution.
**Modification to a Pratt Truss Structure**
A truss structure is a framework composed of straight members arranged in triangular patterns. Compared to fully solid surfaces, it uses significantly less material while achieving highly effective vertical load distribution, thereby overcoming the disadvantage identified in the initial design.
**a. Rationale for Selecting the Pratt Truss Configuration**
A Pratt truss is specifically designed so that the shorter vertical members bear compressive forces, while the longer diagonal members sustain tensile forces. This configuration offers the distinct advantage of evenly distributing loads when transporting a large volume of collected waste on slopes or when subjected to external impacts. Furthermore, because it forms a truss framework within a rectangular geometry, it can be easily integrated into the main frame.
I applied the Pratt truss structure to **Area 1**, which directly receives vertical loads when transporting waste on the robot's back, and to **Area 2**, where it must effectively dissipate impacts from moving obstacles—such as rolling pebbles—to minimize structural damage.

Then, I documented this as form of the journal, and refined the CAD through using the rigid joint & drive joint feature in Fusion
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1NjEsInB1ciI6ImJsb2JfaWQifX0=--20a60bb833c4f7b53628d03f4d1f4b305c73d87c/image.png)


### Recording Links

- https://www.youtube.com/watch?v=yYX7uWMlqn8
- https://www.youtube.com/watch?v=LfWSxQYmrbE
- https://www.youtube.com/watch?v=uAeIrnRmspE
- https://www.youtube.com/watch?v=Hv01efgvxTg
- https://www.youtube.com/watch?v=OOCG4qurGuw
- https://www.youtube.com/watch?v=A64uujh5gkU

## Entry 4
- ID: 15744
- Author: happysunhoo
- Created At: 2026-06-20T19:50:33Z

### Content

#3D printing
All of the hardware I designed comes from 3D printing, where STL model I got after using Fusion goes into the prusa slicer (MK4 and Mini printers)

There was three most important factors for successful building afterwards:

1. The holes for the screw in every plastic parts (M3, M2) must come out perfectly. 
2. The plastic parts itself should fit well with each other, especially between the body-coxa motor bracket and body or within two bearings.
3. For all the motor bracket, obviously, the motor had to fit insight easily and stably. 

Therefore, choosing the right direction for which surface of the 3D model will contact with the printer’s floor, and the positions to attach supporter were critical. I used lot of joints in assembly feature and finalized how the robot will look like when it gets printed out. 

### For the body shell

The body shell has lots of M3 holes and large M8 holes in order for the motor’s jumper line to get through. While inserting the supporter inside the holes were unnecessary as I will have to drill them, I used 0.15mm filaments for high quality result. 

### For the bearings and body-coxa bracket

The bearings and body-coxa bracket commonly had the extruded cylindarical parts that might be falling down. Therefore, I used organic supporters that I can easily rip it out.

### For the tibia

The tibia was challenging part because while I could lay it down only to its side as the end of tibia (foot) are made by curved lines, if I lay it that way then the holes with 8mm diameter might be ripped out or fall. To fix this, I used 0.15mm structual fillament with bunch of organic support arround the hole.
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1NzEsInB1ciI6ImJsb2JfaWQifX0=--8c84538a4ab8b1eef10324f922db734f8024d698/image.png)


### Recording Links

- https://www.youtube.com/watch?v=9XTcvYysu5U
- https://www.youtube.com/watch?v=m5y2GqeN4VU
- https://www.youtube.com/watch?v=YfkJmMRnNZk
- https://www.youtube.com/watch?v=UcQsarVIKdI
- https://www.youtube.com/watch?v=6LcNcwAgO6M
- https://www.youtube.com/watch?v=5kz6FTtN7KI

## Entry 5
- ID: 15748
- Author: happysunhoo
- Created At: 2026-06-20T20:01:45Z

### Content

# 3D Assembly

## Building process

### Attaching exoskeleton frame to the body shell


First step was to attach first exoskeleton to the body using M3 screws. This was because making any arrangement — such as attaching body-coxa motor bracket to the body shell— would place the M3 nuts to block the way in: In other words, this was critical choice for efficiency. 

However, I didn’t fully attach all two exoskeletons since the flate for placing all the electronics must get inside the shell first. 

### Attaching body-coxa motor bracket to the body shell with Bearing bracket

This step was specifically divided into: 

- Attaching motor bracket to the body shell
- Attaching motor to the motor bracket
- Attaching two bearings together
- Attaching bearing to the body shell

I first thought attaching motor to the bracket is more efficient, but soon I noticed that if I attach the motor first, the bracket itself can’t be attached to the shell as there was no place for the driver to go in. Therefore, I changed the order.

When placing the motor inside the bracket, rigidly joining them by M2 nuts were both very challenging and time-consuming. Because I designed the space inside motor bracket to be very tight in order to decrease the length of femur, the pinch or tweezer couldn’t get in, and I had to use my hand (with help of the point-end of the driver) to place the nut through M2 screw. Interestingly, for the outer part the 3D frame bent when I wanted the outer joint to be more rigid, hence I had to find the right amount of tightness which was another challenge. 

However, attaching the bearing together was much more easier process. After that, I first made the pin go through the bearing to the motor itself and hold it by tape; just for temporary joint, as I had to test out if the center of gravity is well designed so that robot can stand by itself. 

### Attaching Femur and Tibia

For femur and tibia, after I hardly attached the motor in to bracket which is contained in the femur, the leftover process was quite easy as I just needed to joint themselves temporarily using motor pins and tape.

Additionally, for the place where bearing will go in I left them as it is for right now, since I didn’t attach the motor to other parts strongly for now.

## Verifying my design


As shown on the photo, the robot stands very well!!!! Hooray!!!! 

I am very proud of myself in terms of attaching the 3D parts in fast time!
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1NzIsInB1ciI6ImJsb2JfaWQifX0=--08253366c495fc0df41efacb5c80f5ef85890a48/image.png)

![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1NzQsInB1ciI6ImJsb2JfaWQifX0=--02bd4cf9fc91d7e17fe13f37c8f805286aabe9d9/image.png)
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1NzUsInB1ciI6ImJsb2JfaWQifX0=--0ee01af83d5a584383aa82c23613b49cf4d0b478/image.png)


### Recording Links

- https://www.youtube.com/watch?v=adi4WtdytWo
- https://www.youtube.com/watch?v=cfRZvQfIxHc
- https://www.youtube.com/watch?v=ZF3bMH_BEgY
- https://www.youtube.com/watch?v=yX7bYly4ND4
- https://www.youtube.com/watch?v=EhuCgjLJgHk
- https://www.youtube.com/watch?v=vvDiTWnYtQU
- https://www.youtube.com/watch?v=wG98qVv-tkA
- https://www.youtube.com/watch?v=60bRAqd2Oxs

## Entry 6
- ID: 15756
- Author: happysunhoo
- Created At: 2026-06-20T20:14:52Z

### Content

#Second draft of the Schematic
!Biome P1 Schematic 1.1 Jun 2 2026.png

## Basic Description

<aside>

**Motor:** 22 motors.

- 18 motors are for the leg  — Instead of 2 motors like I originally planned, 3 motors for each leg will be used.
    
    !image.png
    
    In the original leg design, I planned to use 2 motors and control the knee joint by 4 bar linkage. 
    
    !image.png
    
    However, when I experimented the leg design choice regarding if it will provide stable walking mechanism in mountain terrain (complex, inclined) while carrying heavy amount of waste, the answer was ‘no’. 
    
    Specifically, BIOME’s body must be mostly flat — maintaining 0 degree — since the collected waste will be placed at the back of the robot and when the body is inclined the waste might fall to the ground. To achieve this stability, the femur and knee joint must be controlled individually. For instance, when robot is climbing up, the angle of the knee joint for the bottom 2 legs must be increased. This was the limitation of the previous design, as the femur and knee joint are always ‘linked’ like the video below. 
    
    https://www.youtube.com/shorts/mGQOdvHOWR4
    
    Furthermore, robot can’t also get up if it has only 2 motors per leg — which is critical limitation since robot is highly likely to fall in mountainous terrain. This was the reason Unitree’s robotic dog changed to 2 motors —> 3 motors; In the opposite, boston dynamix spot use special linkage system with 2 BLDC motors because they usually work on controlled, industrial environment. 
    
    !image.png
    
    !image.png
    
- 4 motors were for the arm, since I planned to build 4 DOF robotic arm in order to collect the waste.

**PCA9685: 2** PCA board in order to manage the 22 motors, as the maximum capacity of number of motors PCA board can handle is 16. One PCA board will be handling 2 motors in the arm and 9 motors for the leg; since the robot will use tripod gait, each will control legs placed in zig-zag pattern. The control system would be seperated through soldering where I will set different address for each PCA board. 

**Buck module:** 20A DC-DC stepdown converter used. In addition, 2A converter will be used — this will be enough to fix the Back-EMF. Here, I seperated the power module so that the strong 20A buck converter manages 22 motors, and 2A converter manages the ESP32 controlling system. 

**Battery:** 4 ps of 18650 Li-on battery, which supplies 14.8V to the system. 

**Capacitor:** I added 4700uF bulk capacitor in order to stablize the schematic, together with 2 0.1uF capacitors in PCA board. 

</aside>

## Journal

<aside>

**General Overview:** Some major changes were made, especially since I changed the number of motors per leg; specifically, it also changed the number of PCA board, buck converter, and added process of distributing the control system through soldering.

**What went well:** This schematic system will be operating with much lower possiblity of voltage sag or back-emf occuring, because of its strong usage of capacitor and distributon of both power and control system. I am very proud of myself, as both my skill of drawing the schematic diagram and the diagram itself improved much more compared to the first draft. Now, the diagram doesn’t simply look like I connected each parts, but I can actually see the flow between the parts. 

**What to improve:** While the schematic diagram itself is the final version, making it to actually operate is another problem. Especially, because of the parts I will be using the size of the robot will be larger than I expected at the beginning, which might be exceeding the torque mg90s motors can manage. When I researched, the maximum toruqe capacity was 1.3kg — hence the weight of the parts all together must be tested. Furthermore, it is important that mistake doesn’t happen during process of soldering. 

Here, after finalizing the schematic I shopped for actual parts that I need! Its the start of real building!

</aside>
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1ODUsInB1ciI6ImJsb2JfaWQifX0=--b57c1cae7c7252e33bbc35682799c8cea25196d5/image.png)

![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1ODcsInB1ciI6ImJsb2JfaWQifX0=--ce24a8e487bbcb2e6d8ff9629ca2fe3b83a54d8f/image.png)
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc1OTEsInB1ciI6ImJsb2JfaWQifX0=--efb01932c923b8cacfc3f6d15af5c3fd82de594e/image.png)


### Recording Links

- https://www.youtube.com/watch?v=TE1_paehf9E
- https://www.youtube.com/watch?v=LGCRKMNfrLY
- https://www.youtube.com/watch?v=XsbgzCARXD0
- https://www.youtube.com/watch?v=wG0FZiirqIQ
- https://www.youtube.com/watch?v=ciJN4VNpEUk
- https://www.youtube.com/watch?v=gFoaY9m1b5k

## Entry 7
- ID: 15770
- Author: happysunhoo
- Created At: 2026-06-20T20:32:58Z

### Content

# D1 of Building Schematics

After completing the robot hardware, I started to build the schematics in real life. Initially, I wanted to start from inserting fuse to the + line of the battery holder. However, since I found out I didn’t order fuse holder which is the actual part I had to connect using Wago Connector, I changed the starting point to building VCC and GND.

## Building GND Line

GND Line was the line as below, where the black line coming up from battery holder connects to 

- IN- of 2A Buck Converter
- IN- of 20A Buck Converter
- GND of 2 PCA 9685
- 4700uF Capacitor (While this one is connected to the OUT- in the diagram, since IN- and OUT- are basically the same and I wanted 5p Wago converter to be full, I adjusted during building)

!image.png

### GND Line Structure in Real Life

Here, unlike the schematic diagram I drew in real life I planned to arrange the schematic in 3D as 3 floor structure, so that the robot’s body size are adequate. 

One factor I had to consider was due to the limited place inside the SNDL’s body shell, the 20A buck converter — which was supposed to be placed in the first floor — got to be placed on the third floor. Therefore, the wires’ length must be enough to connect battery holder and buck module across the floor. 

### The Building Process

What I had to do was simple in theory: I needed to cut the wires enough that it can connect across the floor, and use wire stripper to jacket the wires about 11mm in order to connect them using 5p Wago connector. 

However, since I was unfamiliar with the tools, this took me longer time than I expected. Especially, during the process of jacketing the wire in the battery holder, since the wire was less than 22AWG I often mistakenly ‘cut’ the wire instead of ‘jacketing’. 

Besides the holes for Capacitor and battery holder, I mostly used 16AWG lines for the GND lines as there were 18 motors to manage. Problem was that despite there was only 5 holders in Wago connector, there were 2 PCAs. Therefore, I separated the wire using 3p GND wago connector, where first hole connected to the 5p Wago, and second and third hole connected to the PCA board through 22AWG line. 

## Building VCC Line

Building VCC Line was easier than GND line since I got to know the fundamental process and ways of using the tools. One challenge I encountered was that while I had to connect the 15A Schottky diode and 4700uF capacitor’s + side using wago connector, by the previous arrangement where the 20A buck converter were at the back of the 2A converter, diode & capacitor couldn’t reach each other.

Therefore, I changed the arrangement little through replacing the GND wire for 2A converter to longer one (8mm —> 15mm) and placed the 2A converter to the back of the 20A converter.
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc2MjEsInB1ciI6ImJsb2JfaWQifX0=--15e571642b09231d48745be41e56c7e441468e2a/image.png)


### Recording Links

- https://www.youtube.com/watch?v=ovd3_zPZaJA
- https://www.youtube.com/watch?v=9AOiVel8inM
- https://www.youtube.com/watch?v=xjYMOkCbvQI
- https://www.youtube.com/watch?v=Q-QgzA8CEJc
- https://www.youtube.com/watch?v=L8nXFeukuYk
- https://www.youtube.com/watch?v=X67szjDVoHM
- https://www.youtube.com/watch?v=wkqu_AwtE0k
- https://www.youtube.com/watch?v=EI1v-SGmjf0
- https://www.youtube.com/watch?v=_FPb9lVxuUs
- https://www.youtube.com/watch?v=qwRRk4A2GHQ
- https://www.youtube.com/watch?v=ltxVSezOAjc
- https://www.youtube.com/watch?v=Z9pa3Pe9X9M
- https://www.youtube.com/watch?v=WgQjQA_JUiY
- https://www.youtube.com/watch?v=HgXhgUbBR8k
- https://www.youtube.com/watch?v=Yjlszs4umV0
- https://www.youtube.com/watch?v=-hSmEHLml48
- https://www.youtube.com/watch?v=3V-AN4BLx8o
- https://www.youtube.com/watch?v=_CSx-g5wxXg
- https://www.youtube.com/watch?v=hQzdCc2VqiE
- https://www.youtube.com/watch?v=r9wlIWTlyg4
- https://www.youtube.com/watch?v=hrMML7nMt9A
- https://www.youtube.com/watch?v=-hnAimikUg0
- https://www.youtube.com/watch?v=wNa5LgvSyfw
- https://www.youtube.com/watch?v=wEc6Is9XVyY
- https://www.youtube.com/watch?v=pBxRme1RhX4

## Entry 8
- ID: 15862
- Author: happysunhoo
- Created At: 2026-06-21T00:02:03Z

### Content

# D2 of Building Schematics
##Refining CAD and Easy EDA
I refined CAD and Easy EDA, and explored them so that the model inside computer is really similar to the model i am building in the real world. 

## Adding Fuse & Refining VCC and GND line

!image.png

The fuse holder finally arrived, therefore I filled in the second & third port of the 3p wago connector that was already connected to the battery holder’s red line and attached other end of the fuse to the IN+ terminal block of each buck converter.

Furthermore, I found out that the 22AWG line that I used previously to seperate the electricity to each GND and V+ terminal blocks of the PCA board may be to weak and have some risks in the case where the electricity backfires from the 18 motors. Therefore, I changed the wire from 22AWG to 16AWG for more rigid and stable schematic. 

## Connecting PCA boards with GND

After building the GND and VCC line (V+ on the PCA board), it was time to connect the 2 PCA board with ESP 32 via the logic’s VCC, GND, SDA, SCL line and 3V3 & 5V line. 

One problem here was that while I decided to use the wago converter, building the wires drawn in the schematic diagram would be challenging because of these. Specifically, as there is 3 0.1uF capacitor placed on the board, it took me long time to figure out how I will place the wago converter. 

No matter what arrangement I made the schematic in real life looked very ‘weird’. Suddenly, I found out that was primarily because of the wrong capacitor arrangement I made in the schematic. Specifically, for 0.1uF capacitor close to ESP32, its left end was connected to the 2 VCC pins of the PCA board while the right end was connected to the 3V3 pin. This doesn’t make sense since VCC and GND had to be somehow connected with each other in order for robot to actually work.

Therefore, I fixed that through preparing two Wago connector perpendicularly and placing ceramic capacitor at number 1 port like a bridge, while connecting VCC and GND at the second & third ports. 

!image.png

## Using Multimeter for short check & adjusting the buck converter’s voltage

I first used multimeter to check if there is any short circuit between VCC and GND wago. I was first surprised because I could here the ‘beep—’ sound out loud when I placed the two needles from multimeter to VCC and GND wago, but after few second it disappeared. From the research I founded out this was because it takes time to fill 4700uF capacitor, so it is natural phnomenia.

Then, I adjusted the converter’s voltage. Specifically, I seperated the PCA and ESP board for a moment and inserted the battery. At this moment, as the 2A converter had display I unscrewed the gold screw till the voltage reached 5V. In addition, I placed black needle to OUT- of 20A buck converter and the red needle to the wago that connects to the 15A schottky diode where its end connects to the OUT+ of the same buck converter and adjusted voltage to 6V.
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc3OTQsInB1ciI6ImJsb2JfaWQifX0=--a77590828072afe56452e70b6b9f7df182442794/image.png)


### Recording Links

- https://www.youtube.com/watch?v=lJNq1Y64jKQ
- https://www.youtube.com/watch?v=zAhzwX6-J3Y
- https://www.youtube.com/watch?v=iXY9LPPsQqY
- https://www.youtube.com/watch?v=paX2fzIXDzo
- https://www.youtube.com/watch?v=DbPqcR6IrWs
- https://www.youtube.com/watch?v=5_MpYGj-47k
- https://www.youtube.com/watch?v=kO6YGqSOT6k
- https://www.youtube.com/watch?v=FCFHxAM6DKU
- https://www.youtube.com/watch?v=RXZve2CQcwE
- https://www.youtube.com/watch?v=JBFL4yQsenE
- https://www.youtube.com/watch?v=Z24KmCR6G5I
- https://www.youtube.com/watch?v=zcZDvAk5W8Q
- https://www.youtube.com/watch?v=WRuAzk2pDEM
- https://www.youtube.com/watch?v=sbzt86GPKfA
- https://www.youtube.com/watch?v=vOPs4sk2xY0
- https://www.youtube.com/watch?v=FQEW3qRJrHg
- https://www.youtube.com/watch?v=ViOMjzVhQTU
- https://www.youtube.com/watch?v=1jAf7o2TtR0
- https://www.youtube.com/watch?v=qvygB_qvDZc
- https://www.youtube.com/watch?v=q2sysidGGog
- https://www.youtube.com/watch?v=s2KnUEZz0yg

## Entry 9
- ID: 15877
- Author: happysunhoo
- Created At: 2026-06-21T00:29:36Z

### Content

#Gait
SNDL will be using tripod gait, which is a gait mechanism where at least 3 leg (left-front, left-back, right-middle etc.) are standing on the ground and forming triangular shape. This type of gait was chosen because considering the complex & inclined mountainous terrain, tripod gait is the most ‘stable’ gait where there is clear pattern in it — SNDL would be able to survive in diverse situation, such as one leg stuck between the rock, using this gait.

!image.png

For framework regarding programming the basic pattern, the hexabot repository from dtecx was used, but the important variables such as length of the coxa / femur / tibia and motor direction was configured all on my own. 

## Analysis for each files in programming repository regarding configuration: The key

| Config.h | For important configuration such as the following, which must be modified: 
  • The pin number for SDA and SCL for ESP32, and PCA9685 configuration
  • The length of coxa, femur, tibia
  • The motor angle setting for safe pose when SNDL is waiting
  • Motor settings (defaults are for MG996) |
| --- | --- |
| Config.cpp |   • Default toe position (HomeX, HomeY, HomeZ) for the SNDL including motor direction shown as +, - signs.
  • Default coxa position relative to the robot body center. |
| Hardware.h & Hardware.cpp | The layout for which motors are connected to which pin, and declaration of important function such as converting angle to ticks.  |
##During this...
I also finalized everything!Such as documentation, research, etc.


![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc4MTAsInB1ciI6ImJsb2JfaWQifX0=--db5f61e2557aabf9f9c3eb39352c804934bfca70/image.png)


### Recording Links

- https://www.youtube.com/watch?v=3Pfi_dg97z8
- https://www.youtube.com/watch?v=Ywoq23uYsVs
- https://www.youtube.com/watch?v=kJ1svgfRP2w
- https://www.youtube.com/watch?v=CB3BNHhTr84
- https://www.youtube.com/watch?v=nrj5ouOS2Q8
- https://www.youtube.com/watch?v=EC4U_ADl57w
- https://www.youtube.com/watch?v=9qXsyuWZ0nA
- https://www.youtube.com/watch?v=tyAoGYp5ivc
- https://www.youtube.com/watch?v=a00YJaycYQs
- https://www.youtube.com/watch?v=uLoBLicijNw
- https://www.youtube.com/watch?v=Pu1beeegFaw
- https://www.youtube.com/watch?v=HlrXqKuBo08
- https://www.youtube.com/watch?v=t3lXINLyNf4
- https://www.youtube.com/watch?v=NGGXkwBd31Q
- https://www.youtube.com/watch?v=1PLvcdT4wj8
- https://www.youtube.com/watch?v=kAS1ng-mNPo
- https://www.youtube.com/watch?v=i6EG2YNyO6o
- https://www.youtube.com/watch?v=JaWu1jzGNxo

## Entry 10
- ID: 15901
- Author: happysunhoo
- Created At: 2026-06-21T01:56:04Z

### Content

#Finalizing
I finalized and prepared for the submission. Specifically, I inserted the bearings into the 3D assembly, gathered around the electronical parts and mounted them, as well as updating my journal and github.  I even made fantastic zine page which I am proud of! 

Updating the journal was the process where I realized how 'consistency' was important, since I had to stay up all night as it took much longer time than I expected to upload to the youtube. 

Additionally, in terms of setting the robot I finally inserted all the MG90S jumper cables to the PCA boards, and adjusted the tripod gait program corresponding to my motor pin arrangement Then, I setted the 0 degree position by hand by hand which was most difficult. 

However, this project overall was such a fascinating experience I would never forge tand I am very proud of myself. 
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc4ODcsInB1ciI6ImJsb2JfaWQifX0=--b1c63f5181b2267b167b764e8ab0a245894bf03d/image.png)


### Recording Links

- https://www.youtube.com/watch?v=HcYc4moiLxo
- https://www.youtube.com/watch?v=4i0Pc9iPqWw
- https://www.youtube.com/watch?v=Z20AQtWRwUc
- https://www.youtube.com/watch?v=cRy4GZc-wbc
- https://www.youtube.com/watch?v=49nQdlF-n8s
- https://www.youtube.com/watch?v=zVEpPKCb5dQ
- https://www.youtube.com/watch?v=UeZtf7WIbn8
- https://www.youtube.com/watch?v=Aqy31xlWPJA
- https://www.youtube.com/watch?v=ougU7x6Jy1Y
- https://www.youtube.com/watch?v=-BQal_D9pgU
- https://www.youtube.com/watch?v=pE5XwEzwi04
- https://www.youtube.com/watch?v=0756Fxq9pe0
- https://www.youtube.com/watch?v=15uU7NVrTv4
- https://www.youtube.com/watch?v=CUqikMKtQAs
- https://www.youtube.com/watch?v=jbdegPVbHFs

## Entry 11
- ID: 15904
- Author: happysunhoo
- Created At: 2026-06-21T02:05:35Z

### Content

#Few videos which are screen recording of me journaling
The below are the videos where I screen recorded myself journaling!
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzc5MDMsInB1ciI6ImJsb2JfaWQifX0=--1ca4798ca7f5bf380decbd1195a0c59f058baa61/image.png)


### Recording Links

- https://www.youtube.com/watch?v=DrGtfZLzboM
- https://www.youtube.com/watch?v=ZbxmTP_odYw

## Entry 12
- ID: 15935
- Author: happysunhoo
- Created At: 2026-06-21T03:49:11Z

### Content

#Few more videos on the time I spent on building!

For the '3D Assembly' Journal, the video for assemblying body-coxa bracket to body shell wasn't uploaded so I am uploading here. 
![image.png](/user-attachments/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MzgwMzMsInB1ciI6ImJsb2JfaWQifX0=--0b2de07d614b18393907b82905eaa065f2d4a3c1/image.png)


### Recording Links

- https://www.youtube.com/watch?v=FKW1rtA6m6w
- https://www.youtube.com/watch?v=odLo3oKwOVc
- https://www.youtube.com/watch?v=qWznrMQqs9k
- https://www.youtube.com/watch?v=ovuxghogNAE
- https://www.youtube.com/watch?v=sIcxRLs8P2w
