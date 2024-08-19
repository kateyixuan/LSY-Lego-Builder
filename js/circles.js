// sets the studs on the lego baseplate

document.addEventListener("DOMContentLoaded", () => {
    const boardContainer = document.getElementById("board-container");

    function setBoardsize(){
        const viewportHeight= window.innerHeight;
        const viewportWidth= window.innerWidth;

        if (viewportHeight <= viewportWidth) {
            boardContainer.style.width = 80 + "vh";
            boardContainer.style.height =  boardContainer.style.width;
        }
        else if (viewportHeight > viewportWidth){
            boardContainer.style.width = 80 + "vw";
            boardContainer.style.height =  boardContainer.style.width;
        }
    }
    
    // creates a 24 x 24 grid of circles
    function setCircleGrid(){
        for (let i = 0; i < 576; i++) {
            const circle = document.createElement('div');
            circle.classList.add('circle');
            boardContainer.appendChild(circle);
        }
    }

    // removes circles from the corners of the baseplate
    function hideCircles(){
        const totalcircles = 576
        const circles = document.querySelectorAll('.circle'); 
        const gridSize = Math.sqrt(totalcircles);

        circles.forEach((circle, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            
            if (
                (row === 0 && col === 0) || // Top-left corner
                (row === 0 && col === gridSize - 1) || // Top-right corner
                (row === gridSize - 1 && col === 0) || // Bottom-left corner
                (row === gridSize - 1 && col === gridSize - 1) // Bottom-right corner
            ) {
                circle.style.visibility = 'hidden';
            }
        });

    }
    
    
    window.addEventListener('resize', setBoardsize);
    window.addEventListener('resize', setCircleGrid);

    setBoardsize();
    setCircleGrid();
    hideCircles();
    


});