// sets the studs for the side view board

document.addEventListener("DOMContentLoaded", () => {
    const boardContainer = document.getElementById("lego-board-3D-transparent");
    
    function setCircleGrid(){
        console.log("I entered the setCircle function")
        for (let i = 0; i < 24; i++) {
            const studs = document.createElement('div');
            studs.classList.add('studs');
            boardContainer.appendChild(studs);
        }
    }
    setCircleGrid();

});