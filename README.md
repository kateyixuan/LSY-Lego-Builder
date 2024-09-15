# LSY-Lego-Builder
The website is used as an interactive addition to the LSY Lego Project started at the Technical University of Munich. It allows the user to dictate what structure is being built, which blocks it uses, and where it is being placed. Through a drag and drop motion, blocks can be placed on a contrained part of the grid and they can be stacked. When the user is finished, the instructions are sent to Franky (Franka Emika robot) to be built ! 

# Features 
To use this website please follow these instructions (the website is buggy so pls follow carefully...sorry):
1. To move a block, drag the center of the brick
2. To remove a block and return to its original position, double click
3. To stack blocks, press Lock Layer and move the bricks on top
4. To complete the build, press Build
5. To view the build from different perspectives, press Side View and select the side you wish to view from

As this code is in a separate repository from the original project, the Build button will not send any commands but it will export a csv file containing the positions of the lego blocks. This format is how the robot reads which blocks to place and where. 

If you would like to run this project, 
1. Clone the repository
2. Either open index.html on a browser or use the Live Server Extension on VSCode to open index.html

# Notes
This repository only contains the website before final changes were implemented. Namely, this website does not include the camera-feedback feature where the data from the camera dictates which coloured blocks appear on the website. Because this feature is only compatible with the rest of the Lego Project code, it was not included here. If you would like to know more about it, feel free to ask! 

# Images 
![Image](./LegoBuilderv2.png?raw=true)
![Image](./LegoBuilderv1,png?raw=true)

