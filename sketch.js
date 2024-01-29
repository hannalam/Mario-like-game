/*

150 words about the study from this game

Too make this programme more interesting, I added different sounds effect represent the character making jump, getting the collectables and facing enemies. And added platforms with different length and hight for the character to avoid enemies. To make the game more challenging, I added some enemies on the ground and on the platform.

As a beginner from zero knowledge about programming until now, I feel so successful by the step-by-step teaching every week. I applied the knowledge from other computer course during the creation. For instant the variable of objects and data structures. 

I faced some problems about to make the programme work, I spent lots of time to study the details and get reference. But at the end when the programme work, I started the improve a bit the design. I am sure I still can improve more in the future by self-study more.

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var trees_x;
var collectables;
var clouds;
var mountains;
var canyons;

var game_score;
var flagpole;
var lives;

var enemies;
var platforms;
var jumpSound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.mp3');
    jumpSound.setVolume(0.1);
    getSound = loadSound('assets/Get.mp3');
    getSound.setVolume(0.1);
    fallSound = loadSound('assets/Fall.mp3');
    fallSound.setVolume(0.1);
    winSound = loadSound('assets/Won.mp3');
    winSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}

function draw()
{
	background(100, 155, 255); // fill the sky blue
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push();   
    translate(scrollPos,0);

	// Draw clouds.
    drawCloud();

	// Draw mountains.
    drawMountains();

	// Draw trees.
    drawTree();
    
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }

	// Draw canyons.
    for(var i = 0; i < canyons.length; i++)
        {
            drawCanyon(canyons[i]);
            checkCanyon(canyons[i]);
        }

	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
        {
            if(collectables[i].isFound == false)
                {   
                    drawCollectable(collectables[i]);
                    checkCollectable(collectables[i]);
                }     
        }
    
    renderFlagpole();
    
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        
        var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
        
        if(isContact)
        {
            if(lives > 0)
            {
                startGame();
                fallSound.play();
                break;
            }
        }
    }
    
    
    pop();    

    if(lives < 1)
    {
            
        fill(255,0,255);
        strokeWeight();
        stroke(1);
        textAlign(CENTER);
        textSize(70);
        text("Game over", width/2, height/2);
        return;
    }
    
    if(flagpole.isReached)
    {
        fill(255,0,255);
        strokeWeight();
        stroke(1);
        textAlign(CENTER);
        textSize(70);
        text("Level complete", width/2, height/2);
        return;
        
    }
    
    // Draw game character.
	
	drawGameChar();

        
    fill(255);
    noStroke();
    text("Score: " + game_score, 20,20);
    text("Lives: ", 810,20);
    
    // Draw Player score
    checkPlayerDie();
    
    for(var i = 0; i < lives; i++)
    {
        stroke(1);
        strokeWeight(1);
        fill(255,0,255);
        ellipse((30*i)+860 ,17,10,10);
    }
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        
        var isContact = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                break;
            }
        }
        if(isContact == false)
        {   
            gameChar_y += 2;
            isFalling = true;
        }
    }
    else
    {
        isFalling = false;
    }
    
        
    if(isPlummeting)
        {
            gameChar_y += 4;
        }
    
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed(){


    if(keyCode == 37)
    {
        console.log("left arrow");
        isLeft = true;
    }
    
    else if(keyCode == 39)
    {
        console.log("Right arrow");
        isRight = true;
    }
    
    if(keyCode == 32 && gameChar_y >=floorPos_y)
    {
        console.log("space-bar");
        gameChar_y -=100;
        isFalling = true;
        jumpSound.play();
    }

}

function keyReleased()
{

	console.log("release" + keyCode);
	console.log("release" + key);
    
    console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
    
    if(keyCode == 37)
    {
        //console.log("left arrow");
        isLeft = false;
    }
    
    if(keyCode == 39)
    {
        //console.log("Right arrow");
        isRight = false;
    }

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	//the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(188,100,100);
        ellipse(gameChar_x ,gameChar_y - 65,8,15);
        fill(90,0,255);
        rect(gameChar_x - 15 ,gameChar_y - 40, 8, 6);
        ellipse(gameChar_x,gameChar_y - 20,5,5);
        ellipse(gameChar_x - 6,gameChar_y -20,5,5);
        ellipse(gameChar_x - 12,gameChar_y -20,5,5);
        fill(0);
        rect(gameChar_x - 10,gameChar_y - 60,10,17);
        ellipse(gameChar_x ,gameChar_y - 35 ,14,25);
    

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(188,100,100);
        ellipse(gameChar_x ,gameChar_y - 65,8,15);
        fill(90,0,255);
        rect(gameChar_x + 5 ,gameChar_y - 40, 8, 6);
        ellipse(gameChar_x,gameChar_y - 20,5,5);
        ellipse(gameChar_x + 6,gameChar_y - 20,5,5);
        ellipse(gameChar_x + 12,gameChar_y - 20,5,5);
        fill(0);
        rect(gameChar_x,gameChar_y - 60,10,17);
        ellipse(gameChar_x ,gameChar_y - 35 ,14,25);

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(188,100,100);
        ellipse(gameChar_x ,gameChar_y - 40,15,8);
        fill(90,0,255);
        rect(gameChar_x - 15 ,gameChar_y - 20, 8, 6);
        ellipse(gameChar_x,gameChar_y,5,5);
        ellipse(gameChar_x - 5,gameChar_y,5,5);
        ellipse(gameChar_x + 5,gameChar_y,5,5);
        fill(0);
        rect(gameChar_x - 10,gameChar_y - 40,10,17);
        ellipse(gameChar_x ,gameChar_y - 15 ,14,25);


	}
	else if(isRight)
	{
		// add your walking right code
        fill(188,100,100);
        ellipse(gameChar_x ,gameChar_y - 40,15,8);
        fill(90,0,255);
        rect(gameChar_x + 5 ,gameChar_y - 20, 8, 6);
        ellipse(gameChar_x,gameChar_y,5,5);
        ellipse(gameChar_x - 5,gameChar_y,5,5);
        ellipse(gameChar_x + 5,gameChar_y,5,5);
        fill(0);
        rect(gameChar_x,gameChar_y - 40,10,17);
        ellipse(gameChar_x ,gameChar_y - 15 ,14,25);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(188,100,100);
        ellipse(gameChar_x - 12,gameChar_y - 60,8,15);
        ellipse(gameChar_x + 12,gameChar_y - 60,8,15);
        fill(90,0,255);
        rect(gameChar_x +5, gameChar_y - 40, 10, 6);
        rect(gameChar_x - 15 ,gameChar_y - 40, 10, 6);
        ellipse(gameChar_x,gameChar_y - 20,5,5);
        ellipse(gameChar_x - 9,gameChar_y - 20,5,5);
        ellipse(gameChar_x + 9,gameChar_y - 20,5,5);
        fill(0);
        rect(gameChar_x - 10,gameChar_y - 60,20,17);
        ellipse(gameChar_x ,gameChar_y - 35 ,14,25);

	}
	else
	{
		// add your standing front facing code
        fill(188,100,100);
        ellipse(gameChar_x - 12,gameChar_y - 40,15,8);
        ellipse(gameChar_x + 12,gameChar_y - 40,15,8);
        fill(90,0,255);
        rect(gameChar_x - 15 ,gameChar_y - 20, 10, 6);
        rect(gameChar_x +5, gameChar_y - 20, 10, 6);
        ellipse(gameChar_x,gameChar_y,5,5);
        ellipse(gameChar_x - 5,gameChar_y,5,5);
        ellipse(gameChar_x + 5,gameChar_y,5,5);
        fill(0);
        rect(gameChar_x - 10,gameChar_y - 40,20,17);
        ellipse(gameChar_x ,gameChar_y - 15 ,14,25);

	}

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawCloud()
{
    for(var i = 0; i < clouds.length; i++ )
    {
        fill(150,100,200);
        ellipse(clouds[i].x_pos + 220, clouds[i].y_pos, 60, 60);
        ellipse(clouds[i].x_pos + 180, clouds[i].y_pos, 40,40);
        ellipse(clouds[i].x_pos + 260, clouds[i].y_pos, 40,40);
    }

}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i =0; i < mountains.length; i++)
    {
        fill(150,100,100);
        triangle(mountains[i].x_pos ,432,mountains[i].x_pos + 300,432,mountains[i].x_pos + 150,200);
        fill(255);
        triangle(mountains[i].x_pos + 100,262,mountains[i].x_pos + 200,262,mountains[i].x_pos + 150,200);
    }
}

// Function to draw trees objects.
function drawTree()
{
    for(var i = 0; i < trees_x.length; i++)
    {     
        //console.log(trees_x[i]);
        fill(300,200,150);
        rect(trees_x[i],floorPos_y-144,30,144);
        fill(100,255,110);
        ellipse(trees_x[i] + 15,floorPos_y-144,80,80);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
    fill(30,30,30);
    rect(t_canyon.x_pos-10, 432, t_canyon.width - 40 ,144);
    fill(77,77,77);
    rect(t_canyon.x_pos, 432, t_canyon.width - 60, 138);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width -50 && gameChar_y >= floorPos_y)
    {
        isPlummeting = true;
        
        isLeft = false;
        isRight = false;
    }

}

function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y -250);
    fill(255,0,255);
    noStroke();
    
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y -250 ,50, 50);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y -50 ,50, 50);
    }
    
    pop();
}

function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15)
    {
        flagpole.isReached = true;
    }
    
}

function checkPlayerDie()
{
    if(gameChar_y > height)
    {
        lives -= 1;
        
        if(lives > 0)
        {
            startGame();
        }
    }
      
}


function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [100, 300, 900, 1200, 1700];
    collectables = [
                   {x_pos: 0, y_pos: 100, size: 50, isFound: false},
                   {x_pos: 350, y_pos: 100, size: 50, isFound: false},
                   {x_pos: 600, y_pos: 100, size: 50, isFound: false},
                   {x_pos: 950, y_pos: 100, size: 50, isFound: false}
                  ];
    clouds = [
        {x_pos: 150, y_pos: 100}, 
        {x_pos: 400, y_pos: 150}, 
        {x_pos: 600, y_pos: 100},
        {x_pos: 800, y_pos: 150},
        {x_pos: 1000, y_pos: 100},
        {x_pos: 1300, y_pos: 100},
        {x_pos: 1700, y_pos: 100}
    ];
    mountains = [{x_pos: 20},
                 {x_pos: 500},
                 {x_pos: 950},
                 {x_pos: 1450},
                 {x_pos: 1850}
                ];
    canyons = [
              {x_pos: 0, width: 100}, 
              {x_pos: 400, width: 100},
              {x_pos: 800, width: 100},
              {x_pos: 1200, width: 100},
              {x_pos: 1500, width: 100}
             ]
    
    platforms = [];
    
    platforms.push(createPlatforms(100,floorPos_y - 70,100));
    platforms.push(createPlatforms(500,floorPos_y - 100,200));
    platforms.push(createPlatforms(1000,floorPos_y - 50,60));
    platforms.push(createPlatforms(1100,floorPos_y - 50,60));

    game_score = 0;
    
    enemies = []; 
    enemies.push(new Enemies(100, floorPos_y - 10, 100));
    enemies.push(new Enemies(400, floorPos_y - 10, 100));
    enemies.push(new Enemies(500, floorPos_y - 110, 100));
    enemies.push(new Enemies(700, floorPos_y - 60, 200));
    
    flagpole = {isReached: false, x_pos: 1400};
    
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.


function drawCollectable(t_collectable)
{
    fill(155,0,0);
    ellipse(t_collectable.x_pos+326, t_collectable.y_pos+314, t_collectable.size -27, t_collectable.size -33);
    ellipse(t_collectable.x_pos+344, t_collectable.y_pos+314, t_collectable.size -27, t_collectable.size -33);
    ellipse(t_collectable.x_pos+335, t_collectable.y_pos+325, t_collectable.size -27, t_collectable.size -33);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y,t_collectable.x_pos+326, t_collectable.y_pos+314) < 20)
    {
        t_collectable.isFound = true;
        game_score += 1;
        getSound.play();

    }
}

function createPlatforms(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(0, 155, 255);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if( d >= 0 && d < 5)
                {
                    return true;
                }
                
            }
            return false;
        }
    }
    return p;
}

function Enemies(x,y, range)
{
    this.x = x;
    this.y = y;
    this.race = range;
    
    this.currentX = x;
    this.inc = 1;
    
    this.update = function()
    {
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        else if(this.currentX < this.x)
        {
            this.inc = 1;
        }
    }
    
    this.draw = function()
    {
        this.update();
        fill(195, 255, 155);
        ellipse(this.currentX, this.y, 20,20);
    }
    
    this.checkContact = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        console.log(d);
        if(d < 20)
        {
            return true;
        }
        return false;
    }
}
