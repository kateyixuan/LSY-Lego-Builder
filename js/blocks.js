// Creates the studs for each block

document.addEventListener("DOMContentLoaded", () => {
    const block1 = document.getElementById("new-block1");
    const block2 = document.getElementById("new-block2");
    const block3 = document.getElementById("new-block3");
    const block4 = document.getElementById("new-block4");
    const block5 = document.getElementById("new-block5");
    const block6 = document.getElementById("new-block6");
    const block7 = document.getElementById("new-block7");
    const block8 = document.getElementById("new-block8");
    const block9 = document.getElementById("new-block9");

    function setCircleGrid(){
        for (let i = 0; i < 4; i++) {
            const circleyellow = document.createElement('div');
            circleyellow.classList.add('circleyellow');
            block1.appendChild(circleyellow);

            const circlepink = document.createElement('div');
            circlepink.classList.add('circlepink');
            block2.appendChild(circlepink);

            const circleblue = document.createElement('div');
            circleblue.classList.add('circleblue');
            block3.appendChild(circleblue);

            const circlegreen = document.createElement('div');
            circlegreen.classList.add('circlegreen');
            block4.appendChild(circlegreen);

            const circleorange = document.createElement('div');
            circleorange.classList.add('circleorange');
            block5.appendChild(circleorange);

            const circlered = document.createElement('div');
            circlered.classList.add('circlered');
            block6.appendChild(circlered)
            
            const circlewhite = document.createElement('div');
            circlewhite.classList.add('circlewhite');
            block7.appendChild(circlewhite);

            const circledarkgreen = document.createElement('div');
            circledarkgreen.classList.add('circledarkgreen');
            block8.appendChild(circledarkgreen);

            const circlelightyellow = document.createElement('div');
            circlelightyellow.classList.add('circlelightyellow');
            block9.appendChild(circlelightyellow);
        }
    }
    setCircleGrid();
});