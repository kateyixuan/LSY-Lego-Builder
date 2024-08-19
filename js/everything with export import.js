export let board_array = []; // records the position of blocks in each layer
                            // is a list of lists - each list is of length 12 and is one row of the placement area
                            // each layer is split up by an empty list
                            // is updated whenever "lock layer" is pressed

export let board_array_split = []; // same as board_array_split but each layer is split into a list of length 144

// each dictionary records the [layer number, row, column, position] of each block present in a layer 
// the dictionaries are split according to which perspective the board is viewed in
export let locked_blocks_position_dict_top = {'new-block1':[], 'new-block2':[], 'new-block3':[], 'new-block4':[], 'new-block5':[], 'new-block6':[],
    'new-block7':[], 'new-block8':[], 'new-block9':[],};

export let locked_blocks_position_dict_bot = {'new-block1':[], 'new-block2':[], 'new-block3':[], 'new-block4':[], 'new-block5':[], 'new-block6':[],
    'new-block7':[], 'new-block8':[], 'new-block9':[],};

export let locked_blocks_position_dict_right = {'new-block1':[], 'new-block2':[], 'new-block3':[], 'new-block4':[], 'new-block5':[], 'new-block6':[],
    'new-block7':[], 'new-block8':[], 'new-block9':[],};

export let locked_blocks_position_dict_left = {'new-block1':[], 'new-block2':[], 'new-block3':[], 'new-block4':[], 'new-block5':[], 'new-block6':[],
    'new-block7':[], 'new-block8':[], 'new-block9':[],};

export let global_layer_list = []; // records the block ids that are in each layer 

export let layercount = 0; // records the layer number

import { detect_row_positions, button_click } from "./split_screen.js";

document.addEventListener("DOMContentLoaded", () => {
    
    const container = document.getElementById("layout");
    const body = document.getElementById("board-container");
    const blocklist = document.querySelectorAll('#new-block1, #new-block2, #new-block3, #new-block4, #new-block5, #new-block6, #new-block7, #new-block8, #new-block9');
    const button = document.getElementsByClassName('button-locklayer')[0];
    const exportlayer = document.getElementsByClassName('button-exportlayer')[0];
    const layercount_div = document.getElementById("layer-tracking-container");
    const circlelist_blocks = document.querySelectorAll(".circleyellow, .circlepink, .circleblue,.circlegreen, .circleorange, .circlered, .circlewhite, .circledarkgreen, .circlelightyellow");
    const circlelist_board = document.querySelectorAll(".circle");

    // records the locked status of each block in a layer
    // 0 = unlocked
    // 1 = locked
    let locked_blocks_dict = {'new-block1':0, 'new-block2':0, 'new-block3':0, 'new-block4':0, 'new-block5':0, 'new-block6':0,
        'new-block7':0, 'new-block8':0, 'new-block9':0,};

    let blocks_in_previous_layer;

    const split_grid = document.getElementById("split-lego-board");
    
    // setting the width of different containers on the screen
    function setwidth() {
        const layer_container = document.getElementById("layer-tracking-container");
        const layer = body.getBoundingClientRect();
        layer_container.style.left = `${layer.right + 8}px`;
    }
    setwidth();

    function setwidth_anotherone_djkhaled() {
        const instructions_container = document.getElementById("instructions-container");
        const layer = body.getBoundingClientRect();
        instructions_container.style.right = `${layer.right +10 - instructions_container.style.width}px`;
    }
    setwidth_anotherone_djkhaled();

    // variables used to facilitate the movement of each block
    let offsetX, offsetY;
    let originalLeft, originalTop;

    // blocks can be dragged when the mouse is pressed down
    blocklist.forEach(curblock => {
        if (curblock.style.cursor != 'not-allowed'){
            curblock.addEventListener('mousedown', onMouseDown);
        }
    });

    // blocks move back to position on double click
    blocklist.forEach(curblock => {
        curblock.addEventListener('ondblclick', moveback);
    });

    function moveback(event){
        var block = event.target;
        if (block.style.cursor != 'not-allowed'){
            block.style.left = null;
            block.style.top = null;
        }
    }

    var IsDraggable= 0;

    function onMouseDown(event) {
        var block = event.target;

        //distance between clicking the mouse and the block
        offsetX = event.clientX - block.offsetLeft;
        offsetY = event.clientY - block.offsetTop;

        originalLeft = block.style.left;
        originalTop = block.style.top;

        if (locked_blocks_dict[`${block.id}`] === 1){
            block.style.cursor = 'not-allowed';
        }
        else{
            block.addEventListener('mousemove', onMouseMove);
            block.addEventListener('mouseup', ()=>onMouseUp(block));
            block.addEventListener('dblclick', moveback)
            block.style.cursor = 'grabbing';
        }
    };

    function onMouseMove(event) {
        var block = event.target

        if (locked_blocks_dict[`${block.id}`] === 1){
            block.style.cursor = 'not-allowed';
            // console.log("pls dear god (begging)") // not hitting this either
        }
        else {
            let newLeft = event.clientX - offsetX;
            let newTop = event.clientY - offsetY; 
            
            const containerRect = container.getBoundingClientRect();
            const blockRect = block.getBoundingClientRect();

            const bodyRect = body.getBoundingClientRect();

            const spaceleft = bodyRect.left;
            const spacetop = bodyRect.top;

            const constraintTop = containerRect.top - spacetop;
            const constraintLeft = containerRect.left - spaceleft;
            const constraintRight = containerRect.right - spaceleft;
            const constraintBottom = containerRect.bottom - spacetop;

            // keeping the block in the white box 
            if (newLeft < constraintLeft) {
                newLeft = constraintLeft;
            } else if (newLeft + blockRect.width > constraintRight) {
                newLeft = constraintRight - blockRect.width;
            }

            if (newTop < constraintTop) {
                newTop = constraintTop;
            } else if (newTop + blockRect.height > constraintBottom) {
                newTop = constraintBottom - blockRect.height;
            }

            const gridWidth = bodyRect.width/24;
            const gridHeight = bodyRect.height/24;

            // snapping the movement of the brick to the nearest grid
            const snappedX = Math.round(newLeft / gridWidth) * gridWidth;
            const snappedY = Math.round(newTop / gridHeight) * gridHeight;

            block.style.left = `${snappedX}px`;
            block.style.top = `${snappedY}px`;

            // blocks in the same layer cannot overlap else they will return to the previous position
            let isOverlap = false;
            blocklist.forEach(curblock =>{
                if (locked_blocks_dict[`${block.id}`] === 0 && locked_blocks_dict[`${curblock.id}`] === 0 && curblock != block && isOverlapping(block, curblock)){
                    isOverlap=true;
                }
            });

            if (isOverlap){
                block.style.left = originalLeft;
                block.style.top = originalTop;
            }
           
        }
    }

    function onMouseUp(block, left, top) {
        if (block.style.cursor != 'not-allowed'){
            block.removeEventListener('mousemove', onMouseMove);
            block.removeEventListener('mouseup',  onMouseUp);
            block.style.cursor = 'grab';
        }

    }

    function isOverlapping(el1, el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
    }

    // lock layer button functionality
    button.addEventListener("click", () => {
        layercount++;
        IsDraggable = 1; 
        var isEmpty = true; // records if the layer is empty
        var correctly_built = 0; // is used to ensure that there is a block underneath upper layers (no floating blocks)

        // message appears telling the user that the layer is locked or something went wrong
        const layerlocked = document.createElement('div');
        layerlocked.style.color = '#2285e1';
        layerlocked.style.fontFamily= `'Gill Sans', 'Gill Sans MT', 'Calibri', 'Trebuchet MS', 'Helvetica', sans-serif`;
        layerlocked.style.width = '100%';
        layerlocked.style.flexDirection = 'column';
        layerlocked.style.fontSize = '150%';
        layerlocked.style.fontWeight = '600';
        layerlocked.style.marginBottom = '1rem';
        layercount_div.appendChild(layerlocked);

        let blocks_in_layer = []; // records blocks in each layer 

        blocklist.forEach(block => {
            if (isOverlapping(block, container) && locked_blocks_dict[`${block.id}`] === 0){
                blocks_in_layer.push(block);
            }
        });

        // checking if the layer is empty
        if (blocks_in_layer.length != 0) {
            isEmpty = false;
        }
        // recording the current layer as previous layer if it is the first layer
        if (layercount === 1 && isEmpty == false){
            blocks_in_previous_layer = blocks_in_layer.slice();
        }
        
        // checking if blocks from the previous layer overlap with the blocks in the current layer
        // if no floating blocks, correctly_built = blocks_in_layer.length
        blocks_in_layer.forEach(block => {
            var block_overlapped = 0;
            blocks_in_previous_layer.forEach(randomblock => {
                if (block_overlapped == 0 && isOverlapping(block, randomblock) && layercount != 1){
                    correctly_built ++;
                    block_overlapped ++;
                } else if ( layercount === 1 && isEmpty == false){
                    correctly_built = blocks_in_layer.length;
                }
            }
            );

        }); 


        if ((correctly_built === blocks_in_layer.length || layercount === 1) && isEmpty == false){
            layerlocked.textContent = `Layer ${layercount} saved!`;
            blocks_in_layer.forEach(block => {
            locked_blocks_dict[`${block.id}`] = 1;
        })

        global_layer_list.push(blocks_in_layer);
        blocks_in_previous_layer = blocks_in_layer.slice();
        
        // making sure unlocked blocks appear above locked ones (increasing z-index)
        blocklist.forEach(block => {
            if (locked_blocks_dict[`${block.id}`] === 0){
                block.style.zIndex = `${layercount + 2}`;
            }
        });

        var row = Array.apply(null, Array(12)).map(Text.prototype.valueOf,0);

        let blocknodelist = Array.from(circlelist_blocks); // list of all stud/circle IDs

        let filtered_circles_v2 = []; // list of circle ids that are found in the layer

        blocknodelist.forEach(circle => {
            global_layer_list[layercount-1].forEach(block_in_layer => {
                if (block_in_layer.id == circle.parentElement.id){
                    filtered_circles_v2.push(circle);
                }
            })
        })

        // iterating through the board to check if blocks overlap the area
        // used to get the position of each block in order to create a csv file
        circlelist_board.forEach((circle, index) => {
            let isOverlap = false;
            var colour;

            if ((index >= 150 && index <= 161) 
                ||(index >= 174 && index <= 185) 
                ||(index >= 198 && index <=209)
                ||(index >=222 && index <=233)
                ||(index >=246 && index <= 257)
                ||(index >=270 && index <=281)
                ||(index >=294 && index <= 305)
                ||(index >=318 && index <= 329)
                ||(index >= 342 && index <=353)
                ||(index >=366 && index <=377)
                ||(index >=390 && index <=401)
                ||(index >=414 && index <=425)){
                    filtered_circles_v2.forEach(block =>{
                        if (isOverlapping(block, circle)){
                            isOverlap=true;
                            colour = block.className;
                        };
                        
                    });
                    if (isOverlap){
                        var rownumber = 0;
                        var rowindex = 0;
                        if ((index >= 150 && index <= 161)){
                            rownumber = 1
                            rowindex = index - 150;
                        }
                        else if ((index >= 174 && index <= 185) ){
                            rownumber = 2
                            rowindex = index - 174;
                        }
                        else if ((index >= 198 && index <=209)){
                            rownumber = 3
                            rowindex = index - 198;
                        }
                        else if ((index >=222 && index <=233) ){
                            rownumber = 4
                            rowindex = index - 222;
                        }
                        else if ((index >=246 && index <= 257) ){
                            rownumber = 5
                            rowindex = index - 246;
                        }
                        else if ((index >=270 && index <=281)){
                            rownumber = 6
                            rowindex = index - 270;
                        }
                        else if ((index >=294 && index <= 305)){
                            rownumber = 7
                            rowindex = index - 294;
                        }
                        else if ((index >=318 && index <= 329)){
                            rownumber = 8
                            rowindex = index - 318;
                        }
                        else if ((index >= 342 && index <=353)){
                            rownumber = 9
                            rowindex = index - 342;
                        }
                        else if ((index >=366 && index <=377) ){
                            rownumber = 10
                            rowindex = index - 366;
                        }
                        else if ((index >=390 && index <=401)){
                            rownumber = 11
                            rowindex = index - 390;
                        }
                        else if ((index >=414 && index <=425)){
                            rownumber = 12
                            rowindex = index - 414;
                        }
                        row[rowindex] = colour;

                    }

                    colour = 0;
                }
            
            if ((index == 161) || (index == 185) || (index == 209) || (index == 233)
                 || (index == 257) || (index == 281) || (index == 305) || (index == 329)
                || (index == 353) || (index == 377) || (index == 401) || (index == 425)){
                board_array.push(row);
                row = Array.apply(null, Array(12)).map(Text.prototype.valueOf,0);
            }


        });

        let emptyrow = Array.apply(null, Array(12)).map(Text.prototype.valueOf,'');
        board_array.push(emptyrow);

        console.log("board array", board_array)
        detectlayers();
        console.log("board_array_split: ", board_array_split);
        getpositions();
        console.log("locked_blocks_positions_dict", locked_blocks_position_dict_top);
        button_click();
        detect_row_positions();

        //console.log(camera_side)

        }

        else {
            layercount --;
            layerlocked.textContent = `Blocks must be placed above blocks in layer ${layercount}`;
            correctly_built = 0;
        }

    });

    exportlayer.addEventListener("click", () => {
        downloadFile('layer.csv', board_array);
        postData('layer.csv');
        board_array = [];
        board_array_split = [];
    });

    function downloadFile(filename, content){
        
        let csvContent = '';

        content.forEach(function(rowArray, index) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        })

        const blob = new Blob([csvContent], {type:'text/csv;charset=utf-8,'});
        const link = document.createElement('a');
        const objURL = URL.createObjectURL(blob);
        link.setAttribute('href', objURL);
        link.setAttribute('download', filename);

        document.getElementById("buttons-container").appendChild(link);
        link.click();
        document.getElementById("buttons-container").removeChild(link);
    };

    function detectlayers() {
        var layer = 0;
        var single_layer = [];
        var skip_row = 12;
        for (var i = 0; i < board_array.length; i ++){
            if (i == skip_row && i != 0){
                layer ++;
                if (layer == layercount){
                    board_array_split.push(single_layer);
                }
                single_layer = [];
                skip_row += 13;
                continue;
            }
            for (var y = 0; y < board_array[i].length; y++){
                if (i != skip_row && i != 12) {
                    single_layer.push(board_array[i][y])
                }
            }
        }
    
    }

    function getpositions() {
        //console.log("global_layer_list", global_layer_list)
        global_layer_list[layercount-1].forEach(block => {
            //console.log(block.firstChild);
            //console.log(block)
            var circle_to_spot =  block.firstChild.className;
            var count = 0;
            const columns = 12;
            for (var t = 0; t < board_array_split[layercount -1].length; t++){
                const row = Math.floor(t / columns);
                const column = t % columns;
                if (board_array_split[layercount-1][t] == circle_to_spot && count == 0){
                    locked_blocks_position_dict_top[`${block.id}`].push(layercount, row, column, t);
                    locked_blocks_position_dict_bot[`${block.id}`].push(layercount, 11-row, 10-column, t);
                    locked_blocks_position_dict_left[`${block.id}`].push(layercount, column, 10-row, t);
                    locked_blocks_position_dict_right[`${block.id}`].push(layercount, 11-column, row, t);
                    count ++;
                }
            }
        });
        
    }

    // function postData(file) {
    //     $.ajax({
    //         type: "POST",
    //         url: "py/testing.py",
    //         data: { param: file },
    //         success: callbackFunc
    //     });
    // }
    
    // function callbackFunc() {
    //     // do something with the response
    //     console.log("success!");
    // }
    
    //postData('data to process');


    });

    export function getMyVariable() {
        return board_array;
      }

    
//  module.export = {board_array};
// console.log("why bro")
    
