var spacyArr;
var skilltreeArr;
var buttonArr;
var menuArr;

var starfieldArr = [];
var cometArr = [];
var rocketArr = [];
var enemyArr = [];
var enemyRocketArr = [];

var items = {
  scrap: 100,
  stone: 100
};
var logic = {
  start: false,
  pause: false,
  tree: false,
  stats: false,
  escape: false,
  key: 0,
  box: ""
};
var spawn = {
  comet: false,
  starfield: false,
  enemy: false
};
var spacy = {
  hmax: 5,
  dmg: 1,
  speed: 5
};
var rocket = {
  speed: 20,
  gen: false,
  shot: true
};
var enemyRocket = {
  speed: 20,
  gen: false,
  shot: true
};
var comet = {
  speed: 10,
  number: 5
};
var enemy = {
  speed: 10,
  number: 4
};
var starfield = {
  speed: 10,
  number: 5
};
var tree = {
  msg: "",
  hp: 0,
  dmg: 0,
  speed: 0
};
var stats = {
  highscore: 0,
  enemiesKilled: 0,
  cometsKilled: 0,
  cometsCollided: 0
};
var score = 0;

function setup() {
  createCanvas(windowWidth - 20, windowHeight - 20);
  frameRate(50);
  //noCursor();

  spacyArr = new Spacy(
    width / 2,
    height / 2,
    50,
    0,
    0,
    spacy.hmax,
    spacy.dmg,
    spacy.speed
  ); //x, y, r(w+h), f, hmin, hmax, dmg, speed, sp//
  skilltreeArr = new Skilltree(
    width / 2,
    height / 2,
    width / 2,
    height / 2,
    10
  ); //x, y, w, h, e//
  buttonArr = new Button(0, 0, 0, 0); //cbS, cbE, cbA, cbO//
  menuArr = new Menu(); //volm, vols//
}

function draw() {
  background(0, 0, 50);
  boxCheck();
  spawnStarfield();
  logicGates();
}
class Enemy {
  constructor(x, y, r, s, hmin, hmax) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.s = s;
    this.hmin = hmin;
    this.hmax = hmax;
  }

  display() {
    noStroke();
    fill(255, 0, 0);
    triangle(
      this.x + this.r,
      this.y + this.r,
      this.x,
      this.y,
      this.x + this.r,
      this.y - this.r
    );
    fill(0, 0, 0);
    ellipse(this.x, this.y, this.r * 3, this.r / 2);

    fill(255, 0, 0, 50);
    ellipse(this.x - this.r, this.y, this.r / 2, this.r / 3);
  }

  move() {
    this.x = this.x - this.s;
  }

  healthbar() {
    rectMode(CORNER);

    fill(255, 0, 0);
    rect(this.x - this.r / 2, this.y + this.r / 2, this.r, this.r / 5);

    fill(0, 255, 0);
    rect(
      this.x - this.r / 2,
      this.y + this.r / 2,
      this.r - this.hmin * (this.r / this.hmax),
      this.r / 5
    );
  }
}
class EnemyRocket {
  constructor(x, y, w, h, s) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
  }

  display() {
    rectMode(CENTER);

    fill(255, 135, 75);
    rect(this.x, this.y, this.w, this.h);
    triangle(
      this.x - this.w / 2,
      this.y - this.h / 2,
      this.x - this.w,
      this.y,
      this.x - this.w / 2,
      this.y + this.h / 2
    );
  }

  move() {
    this.x = this.x - this.s;
  }

  explode() {
    fill(255, 153, 0);
    ellipse(this.x, this.y, this.w * 2, this.h * 4);
  }
}
class Button {
  constructor(cbS, cbE, cbA, cbO) {
    this.cbS = cbS;
    this.cbE = cbE;
    this.cbA = cbA;
    this.cbO = cbO;
  }

  buttonEnter(x, y, w, h, e, txt) {
    rectMode(CORNER);
    textAlign(CENTER);
    textSize(50);

    stroke(0);
    strokeWeight(5);
    fill(0 + this.cbA, 150 + this.cbA, 0 + this.cbA);
    rect(x, y, w, h, e);

    noStroke();
    fill(0 + this.cbA, 0 + this.cbA, 0 + this.cbA);
    text(txt, x + w / 2, y + h / 2 + 12.5);
  }

  buttonExit(x, y, w, h, e, txt) {
    rectMode(CORNER);
    textAlign(CENTER);
    textSize(50);

    stroke(0);
    strokeWeight(5);
    fill(150 + this.cbE, 0 + this.cbE, 0 + this.cbE);
    rect(x, y, w, h, e);

    noStroke();
    fill(0 + this.cbE, 0 + this.cbE, 0 + this.cbE);
    text(txt, x + w / 2, y + h / 2 + 12.5);
  }

  buttonStart(x, y, w, h, e, txt) {
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(50);

    stroke(0);
    strokeWeight(5);
    fill(150 + this.cbS, 150 + this.cbS, 150 + this.cbS);
    rect(x, y, w, h, e);

    noStroke();
    fill(0 + this.cbS, 0 + this.cbS, 0 + this.cbS);
    text(txt, x, y + 12.5);
  }

  buttonStats(x, y, w, h, e, txt) {
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(50);

    stroke(0);
    strokeWeight(5);
    fill(150 + this.cbO, 150 + this.cbO, 150 + this.cbO);
    rect(x, y, w, h, e);

    noStroke();
    fill(0 + this.cbO, 0 + this.cbO, 0 + this.cbO);
    text(txt, x, y + 12.5);
  }
}
class Menu {
  constructor() {}

  displayStats(
    x,
    y,
    w,
    h,
    e,
    txt0,
    txt1,
    txt2,
    txt3,
    txt4,
    int0,
    int1,
    int2,
    int3
  ) {
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(50);

    stroke(0);
    strokeWeight(5);
    fill(150, 150, 150);
    rect(x, y, w, h, e);

    noStroke();
    fill(0, 0, 0);
    text(txt0, x, y - h / 2 + 50);

    var textArr = [txt1, txt2, txt3, txt4];
    var intArr = [int0, int1, int2, int3];

    for (var i = 0; i < textArr.length; i++) {
      text(textArr[i], x, y - h / 2 + 200 + 200 * i);
      text("" + intArr[i], x, y - h / 2 + 250 + 200 * i);
    }
  }

  displayEscape(x, y, w, h, e, txt) {
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(50);

    stroke(0);
    strokeWeight(5);
    fill(150, 150, 150);
    rect(x, y, w, h, e);

    noStroke();
    fill(0, 0, 0);
    text(txt, x, y - h / 2 + 50);
  }
}
class Skilltree {
  constructor(x, y, w, h, e) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.e = e;
  }

  display(txt) {
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(50);

    stroke(0);
    strokeWeight(5);
    fill(150, 150, 150);
    rect(this.x, this.y, this.w, this.h, this.e);

    noStroke();
    fill(0, 0, 0);
    text(txt, this.x, this.y - this.h / 2 + 50);
  }

  displayStats(w, h, txt0, txt1, txt2, txt3, txt4, int0, int1, int2) {
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(30);

    var textArr = [txt0, txt1, txt2];
    var intArr = [int0, int1, int2];

    for (var i = 0; i < textArr.length; i++) {
      stroke(0);
      strokeWeight(1);

      fill(255, 255, 255);
      rect(this.x - this.w / 2 + w, this.y - (h + w / 2), w, h, this.e);
      rect(
        this.x - this.w / 2 + w + (this.w / 2 * i - w * i),
        this.y,
        w,
        h,
        this.e
      );

      noStroke();
      fill(0, 0, 0);
      text(txt3, this.x - this.w / 2 + w, this.y - (h + h / 2));
      text(
        textArr[i],
        this.x - this.w / 2 + w + (this.w / 2 * i - w * i),
        this.y
      );

      text(
        txt4 + intArr[i],
        this.x - this.w / 2 + w + (this.w / 2 * i - w * i),
        this.y + h + 30
      );
    }
  }

  message(txt) {
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(30);

    stroke(0);
    strokeWeight(1);
    fill(150, 150, 150);
    rect(this.x, this.y + this.h / 4 - 15, this.w / 3, 60);

    noStroke();
    fill(0, 0, 0);
    text(txt, this.x, this.y + this.h / 4);
  }
}
class Rocket {
  constructor(x, y, w, h, s) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
  }

  display() {
    rectMode(CENTER);
    fill(75, 135, 255);
    rect(this.x, this.y, this.w, this.h);
    triangle(
      this.x + this.w / 2,
      this.y - this.h / 2,
      this.x + this.w,
      this.y,
      this.x + this.w / 2,
      this.y + this.h / 2
    );
  }

  move() {
    this.x = this.x + this.s;
  }

  explode() {
    fill(255, 153, 0);
    ellipse(this.x, this.y, this.w * 2, this.h * 4);
  }
}
class Spacy {
  constructor(x, y, r, f, hmin, hmax, dmg, speed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.f = f;
    this.hmin = hmin;
    this.hmax = hmax;
    this.dmg = dmg;
    this.speed = speed;
  }

  display() {
    noStroke();
    fill(0, 0, 255);
    triangle(
      this.x - this.r,
      this.y - this.r,
      this.x,
      this.y,
      this.x - this.r,
      this.y + this.r
    );
    fill(255, 255, 255);
    ellipse(this.x, this.y, this.r * 3, this.r / 2);

    fill(91, 91, 121);
    ellipse(this.x + this.r, this.y, this.r / 2, this.r / 3);
  }

  flame() {
    if (this.f == 0) {
      null; //TEST
    } else if (this.f == 1) {
      fill(255, 0, 0);
      ellipse(this.x - this.r * 2, this.y, this.r, this.r / 2);
      fill(255, 155, 55);
      ellipse(this.x - this.r * 2, this.y, this.r, this.r / 3);
    }
  }

  healthbar(x, y, w, h) {
    rectMode(CORNER);
    textAlign(CENTER);
    textSize(50);

    fill(255, 0, 0);
    rect(x, y, w, h);

    for (var i = 0; i < this.hmax; i++) {
      fill(0, 255, 0);
      rect(x, y, w - this.hmin * (w / this.hmax), h);

      fill(0, 0, 0);
      text(
        this.hmax - this.hmin + "/" + this.hmax,
        x + w / 2,
        y + h / 2 + h / 3
      );
    }
  }

  damagebar(x, y, w, h) {
    rectMode(CORNER);
    textAlign(CENTER);
    textSize(50);

    fill(255, 51, 0);
    rect(x, y, w, h);

    fill(0, 0, 0);
    text(this.dmg, x + w / 2, y + h / 2 + h / 3);
  }

  speedbar(x, y, w, h) {
    rectMode(CORNER);
    textAlign(CENTER);
    textSize(50);

    fill(51, 204, 255);
    rect(x, y, w, h);

    fill(0, 0, 0);
    text(this.speed, x + w / 2, y + h / 2 + h / 3);
  }
}
class Comet {
  constructor(x, y, w, h, s, hmin, hmax) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
    this.hmin = hmin;
    this.hmax = hmax;
  }

  display() {
    noStroke();
    fill(105, 95, 95);
    ellipse(this.x, this.y, this.w, this.h);
    fill(100, 90, 90);
    ellipse(
      this.x + this.w * 0.05,
      this.y - this.h * 0.07,
      this.w * 0.3,
      this.h * 0.3
    );
    ellipse(
      this.x - this.w * 0.04,
      this.y + this.h * 0.2,
      this.w * 0.3,
      this.h * 0.2
    );
    ellipse(
      this.x + this.w * 0.07,
      this.y - this.h * 0.35,
      this.w * 0.2,
      this.h * 0.2
    );
    ellipse(
      this.x - this.w * 0.15,
      this.y - this.h * 0.3,
      this.w * 0.2,
      this.h * 0.2
    );
    ellipse(
      this.x - this.w * 0.25,
      this.y - this.h * 0.2,
      this.w * 0.2,
      this.h * 0.2
    );
    ellipse(
      this.x + this.w * 0.35,
      this.y + this.h * 0.05,
      this.w * 0.2,
      this.h * 0.15
    );
    ellipse(
      this.x + this.w * 0.3,
      this.y + this.h * 0.25,
      this.w * 0.2,
      this.h * 0.25
    );
  }

  move() {
    this.x = this.x - this.s;
  }

  healthbar() {
    rectMode(CORNER);
    textAlign(CENTER);
    textSize(30);

    fill(255, 0, 0);
    rect(this.x - this.w / 2, this.y + this.h / 2, this.w, this.h / 5);

    fill(0, 255, 0);
    rect(
      this.x - this.w / 2,
      this.y + this.h / 2,
      this.w - this.hmin * (this.w / this.hmax),
      this.h / 5
    );
  }
}
class Starfield {
  constructor(x, y, w, h, s) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
  }

  display() {
    noStroke();
    fill(100, 90, 90);
    ellipse(
      this.x + this.x * 0.025,
      this.y - this.y * 0.035,
      this.w * 0.3,
      this.h * 0.3
    );
    ellipse(
      this.x - this.x * 0.02,
      this.y + this.y * 0.1,
      this.w * 0.2,
      this.h * 0.2
    );
    ellipse(
      this.x + this.x * 0.035,
      this.y - this.y * 0.175,
      this.w * 0.2,
      this.h * 0.2
    );
    ellipse(
      this.x - this.x * 0.075,
      this.y - this.y * 0.15,
      this.w * 0.2,
      this.h * 0.2
    );
    ellipse(
      this.x - this.x * 0.005,
      this.y - this.y * 0.1,
      this.w * 0.2,
      this.h * 0.2
    );
    ellipse(
      this.x + this.x * 0.175,
      this.y + this.y * 0.025,
      this.w * 0.2,
      this.h * 0.15
    );
    ellipse(
      this.x + this.x * 0.15,
      this.y + this.y * 0.125,
      this.w * 0.2,
      this.h * 0.25
    );
  }

  move() {
    this.x = this.x - this.s;
  }
}

function bootGame() {
  score++;

  //classes.spacy
  spacyArr.display();
  spacyArr.flame();

  //functions
  if (score >= 100) {
    spawnComet();
  }
  if (score >= 500) {
    spawnEnemy();
  }
  spawnRocket();

  //events.final
  deathEvent();

  //events.hit
  cometHitEvent();
  enemyHitEvent();
  enemyRocketHitEvent();
  cometCollisionEvent();

  //events.pressed
  keyDownEvent();

  //enemy
  enemyShoot();
  //enemyDodge();
}

function boxCheck() {
  if (logic.start == false) {
    if (
      mouseX > width / 1.5 - 200 &&
      mouseX < width / 1.5 + 200 &&
      mouseY > height / 2 - 50 &&
      mouseY < height / 2 + 50
    ) {
      logic.box = "Start";
      buttonArr.cbS = buttonArr.cbS + 100;
      if (buttonArr.cbS >= 100) {
        buttonArr.cbS = 100;
      }
    } else if (
      mouseX > width / 2 - 200 &&
      mouseX < width / 2 + 200 &&
      mouseY > height / 1.5 - 50 &&
      mouseY < height / 1.5 + 50
    ) {
      logic.box = "Stats";
      buttonArr.cbO = buttonArr.cbO + 100;
      if (buttonArr.cbO >= 100) {
        buttonArr.cbO = 100;
      }
    } else {
      logic.box = "";
      buttonArr.cbO = 0;
      buttonArr.cbS = 0;
    }
    if (logic.stats == true) {
      if (
        mouseX > width / 2 - 300 &&
        mouseX < width / 2 - 175 &&
        mouseY > height / 2 + 475 &&
        mouseY < height / 2 + 600
      ) {
        logic.box = "ExitStats";
        buttonArr.cbE = buttonArr.cbE + 100;
        if (buttonArr.cbE >= 100) {
          buttonArr.cbE = 100;
        }
      } else {
        logic.box = "";
        buttonArr.cbE = 0;
      }
    }
  } else if (logic.start == true) {
    if (logic.pause == true) {
      if (logic.tree == true) {
        width / 2 - width / 4, height / 2 + height / 4 - 100, 400, 100, 10;
        if (
          mouseX > width / 2 - width / 4 &&
          mouseX < width / 2 - width / 4 + 400 &&
          mouseY > height / 2 + height / 4 - 100 &&
          mouseY < height / 2 + height / 4
        ) {
          logic.box = "ExitTree";
          buttonArr.cbE = buttonArr.cbE + 100;
          if (buttonArr.cbE >= 100) {
            buttonArr.cbE = 100;
          }
        } else if (
          mouseX >
            width / 2 -
              width / 2 / 2 +
              100 +
              (width / 2 / 2 * 0 - 100 * 0) -
              50 &&
          mouseX <
            width / 2 -
              width / 2 / 2 +
              100 +
              (width / 2 / 2 * 0 - 100 * 0) +
              50 &&
          mouseY > height / 2 - 50 &&
          mouseY < height / 2 + 50
        ) {
          logic.box = "TreeHP";
        } else if (
          mouseX >
            width / 2 -
              width / 2 / 2 +
              100 +
              (width / 2 / 2 * 1 - 100 * 1) -
              50 &&
          mouseX <
            width / 2 -
              width / 2 / 2 +
              100 +
              (width / 2 / 2 * 1 - 100 * 1) +
              50 &&
          mouseY > height / 2 - 50 &&
          mouseY < height / 2 + 50
        ) {
          logic.box = "TreeDMG";
        } else if (
          mouseX >
            width / 2 -
              width / 2 / 2 +
              100 +
              (width / 2 / 2 * 2 - 100 * 2) -
              50 &&
          mouseX <
            width / 2 -
              width / 2 / 2 +
              100 +
              (width / 2 / 2 * 2 - 100 * 2) +
              50 &&
          mouseY > height / 2 - 50 &&
          mouseY < height / 2 + 50
        ) {
          logic.box = "TreeSPEED";
        } else if (
          mouseX >
            width / 2 -
              width / 2 / 2 +
              100 +
              (width / 2 / 2 * 0 - 100 * 0) -
              50 &&
          mouseX <
            width / 2 -
              width / 2 / 2 +
              100 +
              (width / 2 / 2 * 0 - 100 * 0) +
              50 &&
          mouseY > height / 2 - 200 &&
          mouseY < height / 2 - 100
        ) {
          logic.box = "TreeHEAL";
        } else {
          logic.box = "";
          buttonArr.cbE = 0;
        }
      }
      if (logic.escape == true) {
        if (
          mouseX > width / 2 - 500 &&
          mouseX < width / 2 - 375 &&
          mouseY > height / 2 &&
          mouseY < height / 2 + 125
        ) {
          logic.box = "ExitEscape";
          buttonArr.cbE = buttonArr.cbE + 100;
          if (buttonArr.cbE >= 100) {
            buttonArr.cbE = 100;
          }
        } else if (
          mouseX > width / 2 + 375 &&
          mouseX < width / 2 + 500 &&
          mouseY > height / 2 &&
          mouseY < height / 2 + 125
        ) {
          logic.box = "EnterEscape";
          buttonArr.cbA = buttonArr.cbA + 100;
          if (buttonArr.cbA >= 100) {
            buttonArr.cbA = 100;
          }
        } else {
          logic.box = "";
          buttonArr.cbE = 0;
          buttonArr.cbA = 0;
        }
      }
    } else {
      return;
    }
  }
}

function logicGates() {
  if (logic.start == false) {
    if (logic.pause == true) {
      if (logic.stats == true) {
        menuArr.displayStats(
          width / 2,
          height / 2,
          600,
          1200,
          10,
          "Errungenschaften",
          "Highscore: ",
          "Zerstöre Gegner: ",
          "Zerstörte Kometen: ",
          "Selbstmordversuche: ",
          stats.highscore,
          stats.enemiesKilled,
          stats.cometsKilled,
          stats.cometsCollided
        );
        buttonArr.buttonExit(
          width / 2 - 300,
          height / 2 + 475,
          125,
          125,
          10,
          "X"
        );
      }
    } else if (logic.pause == false) {
      startScreen();
      buttonArr.buttonStart(width / 1.5, height / 2, 400, 100, 10, "Start");
      buttonArr.buttonStats(
        width / 2,
        height / 1.5,
        400,
        100,
        10,
        "Errungenschaften"
      );
    }
  } else if (logic.start == true) {
    spacyInterface();
    if (logic.pause == true) {
      if (logic.escape == true) {
        menuArr.displayEscape(
          width / 2,
          height / 2,
          1000,
          250,
          10,
          "Wollen Sie das Spiel verlassen?"
        );
        buttonArr.buttonExit(width / 2 - 500, height / 2, 125, 125, 10, "X");
        buttonArr.buttonEnter(width / 2 + 375, height / 2, 125, 125, 10, "✓");
      }
      if (logic.tree == true) {
        skilltreeArr.display("Skills");
        skilltreeArr.displayStats(
          100,
          100,
          "HP",
          "DMG",
          "SPD",
          "HEAL",
          "LV: ",
          tree.hp,
          tree.dmg,
          tree.speed
        );
        skilltreeArr.message(tree.msg);
        buttonArr.buttonExit(
          width / 2 - width / 4,
          height / 2 + height / 4 - 100,
          400,
          100,
          10,
          "Verlassen"
        );
      }
    } else if (logic.pause == false) {
      bootGame();
    }
  }
}

function enemyShoot() {
  if (enemyRocket.gen == true) {
    if (enemyRocket.shot == true) {
      for (var i = 0; i < enemyArr.length; i++) {
        enemyRocketArr[i] = new EnemyRocket(
          enemyArr[i].x,
          enemyArr[i].y,
          50,
          25,
          enemyRocket.speed
        );
      }
      enemyRocket.shot = false;
    }
    for (var i = 0; i < enemyArr.length; i++) {
      enemyRocketArr[i].display();
      enemyRocketArr[i].move();
      if (enemyRocketArr[i].x < 0) {
        enemyRocketArr[i] = new EnemyRocket(
          enemyArr[i].x,
          enemyArr[i].y,
          50,
          25,
          enemyRocket.speed
        );
      }
    }
  }
}

function deathEvent() {
  if (spacyArr.hmax - spacyArr.hmin <= 0) {
    varResetEvent();
  }
}

function treeBuyEvent() {
  switch (logic.box) {
    case "TreeHP":
      if (items.scrap >= 50) {
        spacyArr.hmax++;
        tree.hp++;
        items.scrap = items.scrap - 50;
        tree.msg = "Deine Gesundheit hat sich erhöht!";
      } else {
        tree.msg = "Du benötigst 50 Metall!";
      }
      break;
    case "TreeDMG":
      if (items.stone >= 50 && items.scrap >= 50) {
        spacyArr.dmg = spacyArr.dmg + 0.5;
        tree.dmg++;
        items.stone = items.stone - 50;
        items.scrap = items.scrap - 50;
        tree.msg = "Deine Stärke hat sich erhöht!";
      } else {
        tree.msg = "Du benötigst 50 Stein und 50 Metall!";
      }
      break;
    case "TreeSPEED":
      if (items.stone >= 50) {
        if (tree.speed < 10) {
          spacyArr.speed++;
          tree.speed++;
          items.stone = items.stone - 50;
          tree.msg = "Deine Geschwindigkeit hat sich erhöht!";
        } else {
          tree.msg = "Die Geschwindigkeit kann nicht weiter steigen!";
        }
      } else {
        tree.msg = "Du benötigst 50 Stein!";
      }
      break;
    case "TreeHEAL":
      if (items.stone >= 25 && items.scrap >= 25) {
        if (spacyArr.hmin > 0) {
          spacyArr.hmin = 0;
          items.scrap = items.scrap - 25;
          items.stone = items.stone - 25;
          tree.msg = "Du komplett wurdest geheilt!";
        } else {
          tree.msg = "Du besitzt bereits maximale Leben!";
        }
      } else {
        tree.msg = "Du benötigst 25 Stein und 25 Metall!";
      }
      break;
  }
}

function varResetEvent() {
  if (stats.highscore < score) {
    stats.highscore = score;
  } else {
    stats.highscore = stats.highscore;
  }
  stats.enemiesKilled = stats.enemiesKilled;
  stats.cometsKilled = stats.cometsKilled;
  stats.cometsCollided = stats.cometsCollided;

  starfieldArr = [];
  cometArr = [];
  rocketArr = [];
  enemyArr = [];
  enemyRocketArr = [];

  spacyArr = new Spacy(
    width / 2,
    height / 2,
    50,
    0,
    0,
    spacy.hmax,
    spacy.dmg,
    spacy.speed
  );
  skilltreeArr = new Skilltree(
    width / 2,
    height / 2,
    width / 2,
    height / 2,
    10
  );
  buttonArr = new Button(0, 0, 0, 0);
  menuArr = new Menu();

  rocket.speed = 20;
  rocket.gen = false;
  rocket.shot = true;

  enemyRocket.speed = 20;
  enemyRocket.gen = false;
  enemyRocket.shot = true;

  comet.speed = 10;
  comet.number = 5;

  starfield.speed = 10;
  starfield.number = 5;

  enemy.speed = 10;
  enemy.number = 4;

  items.scrap = 100;
  items.stone = 100;

  spawn.comet = false;
  spawn.starfield = false;
  spawn.enemy = false;

  spacy.hmax = 5;
  spacy.dmg = 1;
  spacy.speed = 5;

  tree.msg = "";
  tree.hp = 0;
  tree.dmg = 0;
  tree.speed = 0;

  logic.start = false;
  logic.pause = false;
  logic.tree = false;
  logic.stats = false;
  logic.escape = false;
  logic.key = 0;
  logic.box = "";

  score = 0;
}

function cometCollisionEvent() {
  for (i = 0; i < cometArr.length; i++) {
    var d = dist(
      cometArr[i].x + cometArr[i].w / 2,
      cometArr[i].y + cometArr[i].h / 2,
      spacyArr.x + spacyArr.r * 3,
      spacyArr.y
    );

    if (d <= cometArr[i].w) {
      spacyArr.hmin = spacyArr.hmin + cometArr[i].hmax;
      stats.cometsCollided++;
      cometArr[i].x = Math.floor(random(width, width + width));
      cometArr[i].y = Math.floor(random(0, height));
      cometArr[i].w = Math.floor(random(100, 125));
      cometArr[i].h = Math.floor(random(100, 125));
      cometArr[i].hmin = 0;
      cometArr[i].hmax = Math.floor(
        random(0 + score / 2000, 5 + score / 2000) + 1
      );
    }
  }
}

function cometHitEvent() {
  if (rocket.gen == true) {
    for (var i = 0; i < cometArr.length; i++) {
      for (var j = 0; j < rocketArr.length; j++) {
        var d = dist(
          cometArr[i].x,
          cometArr[i].y,
          rocketArr[j].x,
          rocketArr[j].y
        );
        if (d < cometArr[i].w / 2 + 50) {
          rocket.gen = false; //Weiterleitung an selbst und SpawnRocket.js und MousePressedEvent.js
          rocketArr[j].explode();
          cometArr[i].hmin = cometArr[i].hmin + spacyArr.dmg;
          if (cometArr[i].hmax - cometArr[i].hmin <= 0) {
            stats.cometsKilled++;
            items.stone = items.stone + cometArr[i].hmax;
            cometArr[i].x = Math.floor(random(width, width + width));
            cometArr[i].y = Math.floor(random(0, height));
            cometArr[i].w = Math.floor(random(100, 125));
            cometArr[i].h = Math.floor(random(100, 125));
            cometArr[i].hmin = 0;
            cometArr[i].hmax = Math.floor(
              random(0 + score / 2000, 5 + score / 2000) + 1
            );
          }
        }
      }
    }
  }
}

function enemyHitEvent() {
  if (rocket.gen == true) {
    for (var i = 0; i < enemyArr.length; i++) {
      for (var j = 0; j < rocketArr.length; j++) {
        var d = dist(
          enemyArr[i].x,
          enemyArr[i].y,
          rocketArr[j].x,
          rocketArr[j].y
        );
        if (d < enemyArr[i].r * 2) {
          rocket.gen = false; //Weiterleitung an selbst und SpawnRocket.js und MousePressedEvent.js
          rocketArr[j].explode();
          enemyArr[i].hmin = enemyArr[i].hmin + spacyArr.dmg;
          if (enemyArr[i].hmax - enemyArr[i].hmin <= 0) {
            stats.enemiesKilled++;
            items.scrap = items.scrap + enemyArr[i].hmax;
            enemyArr[i].x = Math.floor(random(width, width + width));
            enemyArr[i].y = Math.floor(random(0, height));
            enemyArr[i].r = 50;
            enemyArr[i].hmin = 0;
            enemyArr[i].hmax = Math.floor(
              random(0 + score / 2000, 5 + score / 2000) + 1
            );
          }
        }
      }
    }
  }
}

function enemyRocketHitEvent() {
  if (enemyRocket.gen == true) {
    for (var i = 0; i < enemyRocketArr.length; i++) {
      var d = dist(
        enemyRocketArr[i].x,
        enemyRocketArr[i].y,
        spacyArr.x,
        spacyArr.y
      );
      if (d < spacyArr.r) {
        enemyRocketArr[i].explode();
        enemyRocketArr[i] = new EnemyRocket(
          enemyArr[i].x,
          enemyArr[i].y,
          50,
          25,
          enemyRocket.speed
        );
        spacyArr.hmin++;
      }
    }
  }
}

function keyDownEvent() {
  if (keyIsDown(87)) {
    logic.key = 87;
  } else if (keyIsDown(83)) {
    logic.key = 83;
  } else if (keyIsDown(65)) {
    logic.key = 65;
  } else if (keyIsDown(68)) {
    logic.key = 68;
  } else if (!keyIsDown()) {
    logic.key = 0;
  }

  switch (logic.key) {
    case 87:
      if (spacyArr.y - spacyArr.r <= 0) {
        spacyArr.y = spacyArr.r;
        break;
      } else {
        spacyArr.y = spacyArr.y - spacyArr.speed;
        spacyArr.f = 0;
        break;
      }
    case 83:
      if (spacyArr.y + spacyArr.r >= height) {
        spacyArr.y = height - spacyArr.r;
        break;
      } else {
        spacyArr.y = spacyArr.y + spacyArr.speed;
        spacyArr.f = 0;
        break;
      }
    case 65:
      if (spacyArr.x - spacyArr.r <= 0) {
        spacyArr.x = spacyArr.r;
        break;
      } else {
        spacyArr.x = spacyArr.x - spacyArr.speed;
        spacyArr.f = 0;
        break;
      }
    case 68:
      if (spacyArr.x - spacyArr.r >= width) {
        spacyArr.x = width - spacyArr.r * 2;
        break;
      } else {
        spacyArr.x = spacyArr.x + spacyArr.speed;
        spacyArr.f = 1;
        break;
      }
    case 0:
      spacyArr.f = 0;
      spacyArr.x = spacyArr.x;
      spacyArr.y = spacyArr.y;
      break;
  }
}

function keyPressed() {
  if (logic.start == true) {
    if (logic.pause == false) {
      switch (keyCode) {
        case 70:
          logic.pause = true;
          logic.tree = true;
          tree.msg = "Hier stehen Infos!";
          break;
        case 27:
          logic.pause = true;
          logic.escape = true;
          break;
      }
    }
  }
}

function mousePressed() {
  if (logic.start == false) {
    switch (logic.box) {
      case "Start":
        logic.start = true;
        break;
      case "Stats":
        logic.pause = true;
        logic.stats = true;
        break;
      case "ExitStats":
        logic.pause = false;
        logic.stats = false;
        break;
    }
  } else if (logic.start == true) {
    switch (logic.box) {
      case "Escape":
        logic.pause = true;
        logic.escape = true;
        break;
      case "ExitEscape":
        logic.pause = false;
        logic.escape = false;
        break;
      case "EnterEscape":
        varResetEvent();
        break;
      case "ExitTree":
        logic.pause = false;
        logic.tree = false;
        break;
      case "TreeHP":
        treeBuyEvent();
        break;
      case "TreeDMG":
        treeBuyEvent();
        break;
      case "TreeSPEED":
        treeBuyEvent();
        break;
      case "TreeHEAL":
        treeBuyEvent();
        break;
    }
    if (rocket.gen == false) {
      rocket.gen = true; //Weiterleitung an SpawnRocket.js und CometDestroyEvent.js
      rocket.shot = true; //Weiterleitung an SpawnRocket.js
    }
  }
}

function spawnComet() {
  if (spawn.comet == false) {
    for (var i = 0; i < comet.number; i++) {
      cometArr[i] = new Comet(
        Math.floor(random(width, width + width)),
        Math.floor(random(0, height)),
        Math.floor(random(100, 125)),
        Math.floor(random(100, 125)),
        comet.speed,
        0,
        Math.floor(random(0, 5) + 1)
      );
    }
    spawn.comet = true;
  } else if (spawn.comet == true) {
    for (var i = 0; i < cometArr.length; i++) {
      if (cometArr[i].x < 0 - cometArr[i].w) {
        cometArr[i].x = Math.floor(random(width, width + width));
        cometArr[i].y = Math.floor(random(0, height));
        cometArr[i].w = Math.floor(random(100, 125));
        cometArr[i].h = Math.floor(random(100, 125));
        cometArr[i].hmax = Math.floor(
          random(0 + score / 2000, 5 + score / 2000) + 1
        );
      }
    }
    for (var i = 0; i < cometArr.length; i++) {
      cometArr[i].move();
      cometArr[i].display();
      cometArr[i].healthbar();
    }
  }
}

function spawnEnemy() {
  if (spawn.enemy == false) {
    for (var i = 0; i < enemy.number; i++) {
      enemyArr[i] = new Enemy(
        Math.floor(random(width, width + width)),
        Math.floor(random(0, height)),
        50,
        enemy.speed,
        0,
        Math.floor(random(0, 5) + 1)
      );
    }
    enemyRocket.gen = true;
    spawn.enemy = true;
  } else if (spawn.enemy == true) {
    for (var i = 0; i < enemyArr.length; i++) {
      enemyArr[i].display();
      enemyArr[i].healthbar();
      if (enemyArr[i].x <= width - 100) {
        null; //TEST
      } else {
        enemyArr[i].move();
      }
    }
  }
}

function spawnRocket() {
  if (rocket.gen == true) {
    if (rocket.shot == true) {
      for (var i = 0; i < 1; i++) {
        //damage wert einfügen!
        rocketArr[i] = new Rocket(spacyArr.x, spacyArr.y, 50, 25, rocket.speed);
      }
      rocket.shot = false; //Weiterleitung an selbst!
    }
    for (var i = 0; i < rocketArr.length; i++) {
      rocketArr[i].display();
      rocketArr[i].move();
      if (rocketArr[i].x > width) {
        rocket.gen = false; //Weiterleitung an selbst und CometDestroyEvent.js und MousePressedEvent.js
      }
    }
  }
}

function spawnStarfield() {
  if (spawn.starfield == false) {
    for (var i = 0; i < starfield.number; i++) {
      starfieldArr[i] = new Starfield(
        Math.floor(random(width, width + width)),
        Math.floor(random(0, height)),
        Math.floor(random(10, 30)),
        Math.floor(random(10, 30)),
        starfield.speed
      );
    }
    spawn.starfield = true;
  } else if (spawn.starfield == true) {
    for (var i = 0; i < starfieldArr.length; i++) {
      if (starfieldArr[i].x < 0 - starfieldArr[i].w) {
        starfieldArr[i].x = Math.floor(random(width, width + width));
        starfieldArr[i].y = Math.floor(random(0, height));
        starfieldArr[i].w = Math.floor(random(10, 30));
        starfieldArr[i].h = Math.floor(random(10, 30));
      }
    }
    for (var i = 0; i < starfieldArr.length; i++) {
      starfieldArr[i].move();
      starfieldArr[i].display();
    }
  }
}

function spacyInterface() {
  rectMode(CORNER);
  imageMode(CORNER);

  fill(0, 0, 0, 100);
  rect(0, 0, 400, 200);

  textSize(20);
  textAlign(LEFT);
  fill(255, 255, 255);
  text("Punkte: " + score, 0, 135);
  text("Steine: " + items.stone, 0, 35);
  text("Metall: " + items.scrap, 0, 85);

  spacyArr.healthbar(200, 0, 200, 50);
  spacyArr.damagebar(200, 50, 200, 50);
  spacyArr.speedbar(200, 100, 200, 50);
}

function startScreen() {
  textAlign(CENTER);
  textSize(200);

  fill(255, 255, 255);
  text("JebJet", width / 2, height / 2 - height / 4);
  stroke(255, 255, 255);
  strokeWeight(10);
  line(
    width / 2 - width / 3,
    height / 2 - height / 4 + 50,
    width / 2 + width / 3,
    height / 2 - height / 4 + 50
  );
  line(
    width / 2 - width / 3,
    height / 2 - height / 4 + 100,
    width / 2 + width / 3,
    height / 2 - height / 4 + 100
  );
}
