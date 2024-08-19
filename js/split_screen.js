// creates the functionality of the splitscreen-sideview

import { layercount, global_layer_list, locked_blocks_position_dict_top, locked_blocks_position_dict_bot, locked_blocks_position_dict_left, locked_blocks_position_dict_right} from "./everything with export import.js";

const split_grid = document.getElementById("split-lego-board");

var grid_tracking = []; // list of which blocks are shown in the sideview

export const button1 = document.getElementsByClassName("north-button")[0];
export const button2 = document.getElementsByClassName("south-button")[0];
export const button3 = document.getElementsByClassName("east-button")[0]; //is actually the button on the left (oops I dont know my directions sue me)
export const button4 = document.getElementsByClassName("west-button")[0]; // is actually the button on the right (")

export var camera_side = 0; // stores which button is pressed, 1- top, 2-bottom, 3-left, 4-right

document.addEventListener("DOMContentLoaded", () => {   
    const splitscreen = document.getElementsByClassName("button-splitscreen")[0];
    const container = document.getElementById("lego-board");
    const board_container = document.getElementById("board-container");
    const new_split = document.getElementById("split-left");
    const new_split_2 = document.getElementById("split-right");
    const title = document.getElementById("title-container");
    const buttons = document.getElementById("buttons-container");
    const layer_tracking = document.getElementById("layer-tracking-container");
    const body = document.body;
    const line = document.getElementById("line");

    const instructions = document.getElementById("instructions-container")

    const split_right_container = document.getElementById("container-stuff");
    const board_split = document.getElementById("lego-board-3D");

    const split_grid = document.getElementById("split-lego-board");

    var num = 0;
    var IsSplit = false;

    splitscreen.addEventListener("click", () => {
        num ++;
        if (num % 2 != 0){
            IsSplit = true;
            make_split();
        }

        else {
            IsSplit = false;
            remove_split();
        } 
    });

    function make_split() {
        new_split.appendChild(container);
        new_split.appendChild(title);
        new_split.appendChild(buttons);
        new_split.appendChild(board_container);
        setwidth(board_container, layer_tracking);

        line.style.visibility = 'visible';
        setwidth(layer_tracking, line);

        new_split_2.style.visibility = 'visible';

        buttons.style.columnGap ='1%';

        instructions.style.visibility = 'hidden';
    } 
    
    function remove_split() {
        new_split.removeChild(board_container);
        new_split.removeChild(buttons);
        new_split.removeChild(title);
        new_split.removeChild(container);

        body.appendChild(container);
        body.appendChild(title);
        body.appendChild(buttons);
        body.appendChild(board_container);
        setwidth(board_container, layer_tracking);

        line.style.visibility = 'hidden';
        new_split_2.style.visibility= 'hidden';

        buttons.style.columnGap = null;
        body.style.gridRow
        instructions.style.visibility = 'visible';
    }

    function setwidth(reference, item) {
        const layer = reference.getBoundingClientRect();
        item.style.left = `${layer.right + 8}px`; 
    } 

});

button1.addEventListener("click", () => {
    camera_side = 1;

    while (split_grid.firstChild) { 
        split_grid.removeChild(split_grid.firstChild); 
    }

    button2.style.backgroundColor='#ffdd57';
    button3.style.backgroundColor='#ffdd57';
    button4.style.backgroundColor='#ffdd57';
    button1.style.backgroundColor = '#fca131';

    detect_row_positions(locked_blocks_position_dict_top);
})

button2.addEventListener("click", () => {
    camera_side = 2;
    while (split_grid.firstChild) { 
        split_grid.removeChild(split_grid.firstChild); 
    }

    button1.style.backgroundColor='#ffdd57';
    button3.style.backgroundColor='#ffdd57';
    button4.style.backgroundColor='#ffdd57';
    button2.style.backgroundColor = '#fca131';

    detect_row_positions(locked_blocks_position_dict_bot);
})

button3.addEventListener("click", () => {
    camera_side = 3;

    while (split_grid.firstChild) { 
        split_grid.removeChild(split_grid.firstChild); 
    }

    button2.style.backgroundColor='#ffdd57';
    button1.style.backgroundColor='#ffdd57';
    button4.style.backgroundColor='#ffdd57';
    button3.style.backgroundColor = '#fca131';
 
    detect_row_positions(locked_blocks_position_dict_left);
})

button4.addEventListener("click", () => {
    camera_side = 4;

    while (split_grid.firstChild) { 
        split_grid.removeChild(split_grid.firstChild); 
    }

    button2.style.backgroundColor='#ffdd57';
    button3.style.backgroundColor='#ffdd57';
    button1.style.backgroundColor='#ffdd57';
    button4.style.backgroundColor = '#fca131';

    detect_row_positions(locked_blocks_position_dict_right);
})

// function updates the grid_tracking list based on which blocks have the lowest row count
export function detect_row_positions(locked_blocks_position_dict) {
    global_layer_list.forEach(layer => { 
        grid_tracking = Array.apply(null, Array(12)).map(Text.prototype.valueOf,0);
        layer.forEach(block => {
            var rows = locked_blocks_position_dict[block.id][1];
            var cols = locked_blocks_position_dict[block.id][2];
                
                    if (grid_tracking[cols] != 0){
                        if (grid_tracking[cols+1] != 0){
                            if (grid_tracking[cols] == grid_tracking[cols+1] && locked_blocks_position_dict[`${grid_tracking[cols]}`][1] > rows){
                                grid_tracking[cols] = `${block.id}`;
                                grid_tracking[cols + 1]= `${block.id}`;
                            } else if (grid_tracking[cols] != grid_tracking[cols+1]){
                                if (locked_blocks_position_dict[grid_tracking[cols]][1] > rows && locked_blocks_position_dict[grid_tracking[cols + 1]][1] < rows){
                                    grid_tracking[cols] = `${block.id}`;
                                } else if (locked_blocks_position_dict[`${grid_tracking[cols]}`][1] > rows && locked_blocks_position_dict[`${grid_tracking[cols + 1]}`][1] > rows){
                                    grid_tracking[cols] = `${block.id}`;
                                    grid_tracking[cols + 1]= `${block.id}`;
                                } else if (locked_blocks_position_dict[grid_tracking[cols]][1] < rows && locked_blocks_position_dict[grid_tracking[cols + 1]][1] > rows){
                                    grid_tracking[cols + 1]= `${block.id}`;
                                }
                            }
                        } else if (grid_tracking[cols+1] == 0){
                            if (locked_blocks_position_dict[`${grid_tracking[cols]}`][1] > rows){
                                grid_tracking[cols] = `${block.id}`;
                                grid_tracking[cols + 1]= `${block.id}`;
                            } else if (locked_blocks_position_dict[`${grid_tracking[cols]}`][1] < rows){
                                grid_tracking[cols + 1]= `${block.id}`;
                            }
                        }
                    } else if (grid_tracking[cols] == 0){
                        if (grid_tracking[cols+1] == 0){
                            grid_tracking[cols] = `${block.id}`;
                            grid_tracking[cols + 1]= `${block.id}`;
                        } else if (grid_tracking[cols+1] != 0){
                            if (locked_blocks_position_dict[`${grid_tracking[cols+1]}`][1] > rows){
                                grid_tracking[cols] = `${block.id}`;
                                grid_tracking[cols + 1]= `${block.id}`;
                            } else {
                                grid_tracking[cols] = `${block.id}`;
                            }
                        }
                    }
            
            
        })

        var skip = false;

        // loops through the list to create blocks on the screen
        // full block will appear when there are two conscecutive and equal block ids
        // half block will appear when a block id appears once
        for (var w = 0; w < 12; w++){
            if (grid_tracking[w] != 0 && skip == false){
                if (grid_tracking[w+1] != 0 && grid_tracking[w+1] == grid_tracking[w]){
                    var newblock = document.createElement("div");
                    newblock.id = `${grid_tracking[w]}-split`;
            
            
                    split_grid.append(newblock);
                    newwidth(newblock);

                    newblock.style.gridRowStart = `${13 - locked_blocks_position_dict[`${grid_tracking[w]}`][0]}`;
                    newblock.style.gridColumnStart = `${11 - locked_blocks_position_dict[`${grid_tracking[w]}`][2]}`;

                    skip = true;
                } else if (grid_tracking[w+1] != grid_tracking[w]){
                    var newblock1 = document.createElement("div");
                    newblock1.id = `${grid_tracking[w]}-split`;
            
            
                    split_grid.append(newblock1);
                    newwidthhalf(newblock1);

                    console.log("row", locked_blocks_position_dict[`${grid_tracking[w]}`][1]);
                    console.log("columns", locked_blocks_position_dict[`${grid_tracking[w]}`][2])

                    newblock1.style.gridRow = `${13 - locked_blocks_position_dict[`${grid_tracking[w]}`][0]}`;
                    newblock1.style.gridColumn = `${12 - w}`;
                }
            } else if (grid_tracking[w] != 0 && skip == true){
                skip = false;
                continue
            } else{
                continue
            }
        }

        })

    
}

// checks camera_side and constantly updates the sideview whenever a new layer is locked 
// (without having to press the sideview buttons again)
export function button_click() {   
    console.log("camera side:", camera_side)

    if (camera_side == 1){
        console.log("button1 should be clicked", button1)
        button1.click();
    } else if (camera_side == 2){
        button2.click();
    } else if (camera_side == 3){
        button3.click();
    } else if (camera_side ==4){
        button4.click();
    }
}

export function newwidth(block){
    block.style.width = `${2*(split_grid.getBoundingClientRect().width / 12)}px`;
    block.style.height = `${split_grid.getBoundingClientRect().height / 12}px`;
}

export function newwidthhalf(block){
    block.style.width = `${(split_grid.getBoundingClientRect().width / 12)}px`;
    block.style.height = `${split_grid.getBoundingClientRect().height / 12}px`;
}

export function makeemptygrid(){
    grid_tracking = [];
    var grid_tracking_row = Array.apply(null, Array(12)).map(Text.prototype.valueOf,0);
    for (var f = 0; f < 12; f++){
    grid_tracking.push(grid_tracking_row);
}
}

export function studs(block){
    for (var i = 0; i < 2; i++){
        console.log(`${block.id}-studs`)
        const stud = document.createElement('div');
        stud.classList.add(`${block.id}-studs`);
        block.appendChild(stud);
    }
}

