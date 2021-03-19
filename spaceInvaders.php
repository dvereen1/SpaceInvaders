<?php include_once('headNoNav.php');?> 
        <title>DJV Space Invaders</title>
        <link href = "/CSS/allProjectsModal.css" rel = "stylesheet">
        <link rel="stylesheet" href="spaceInvaders.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    </head>
    <body>
        <?php include_once("Classes/projectInfoModal.php");
            createProjectModal("Space Invaders", $projectModalArr);
        ?>
        <header>
            <nav>
                <a class = "logo" href = "/#portfolio-">DJV</a>
                <ul id = "menu">
                    <li class="menu-link">
                        <a href="/#portfolio-">
                            Portfolio
                        </a>
                    </li>
                    <li class = "menu-link">
                        <a href ="https://github.com/dvereen1/SpaceInvaders">View Code</a>
                    </li>
                </ul>
             
            </nav>
        </header>        
        <section class = "djv-container">
            <h1 class = "game-title">
                Space Invaders
            </h1>
            <canvas width = 640 height = 400 id ="canvas">
            </canvas>

            <!--<div class = "gameInfo">
                <div class="instructions">
                    <h2>
                        Instructions
                    </h2>
                    <p>* Press left and right arrow keys to move.</p>
                    <p>* Press SPACEBAR to fire.</p>
                    <p>* Press ESC to pause or resume.</p>
                </div>
             
               <div class = "gi-title">
                    <i class="fas fa-bug"></i>
                    <h2>Known Bugs</h2>
                </div>
                <p>1.) Ball sometimes sticks to paddle</p>
                <p>2.) Ball sometimes sticks to bricks</p>
                <p>3.) Due to 2.) ball sometimes gets caught in the Brick region, never falling back to the paddle</p>
            </div>-->
        </section>
    </body>
    <script src = "/JS/allProjectsModal.js"></script>
    <script src = "spaceInvaders.js"></script>
</html>