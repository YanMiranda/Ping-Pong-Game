let bolaImg;
let jogadorImg;
let computadorImg;
let fundoImg;
let quicarSom;
let golSom;
let pontosJogador = 0;
let pontosComputador = 0;

class Raquete {
  constructor(x) {
    this.x = x;
    this.y = height / 2;
    this.w = 60;
    this.h = 60;
  }
  update() {
    // se a raquete é o jogador
    if (this.x < width / 2) {
      this.y = mouseY;
    } else {
      // se a bola está em cima vai pra cima
      if (bola.y < this.y) {
        this.y -= 5;
      } else {
        // se a bola está em baixo vai pra baixo
        this.y += 5;
      }
    }

    //limitar dentro da tela
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y > height - this.h) {
      this.y = height - this.h;
    }
  }
  desenha() {
    //se a raquete é o jogador
    if (this.x < width / 2) {
      image(jogadorImg, this.x, this.y, this.w, this.h);
    } else {
      image(computadorImg, this.x, this.y, this.w, this.h);
    }
  }
}

class Bola {
  constructor() {
    this.r = 15;
    this.reset();
    this.angulo = 0;
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    const velocidadeMaxima = 5;
    this.velX = Math.random() * velocidadeMaxima * 2 - velocidadeMaxima;
    this.velY = Math.random() * velocidadeMaxima * 2 - velocidadeMaxima;
    this.angulo = 0;
  }

  update() {
    this.x += this.velX;
    this.y += this.velY;

    //rotaciona de acordo com a velocidade x e y
    this.angulo +=
      Math.sqrt(this.velX * this.velX + this.velY * this.velY) / 30;

    if (this.x < this.r || this.x > width - this.r) {
      if (this.x < this.r) {
        pontosComputador++;
      } else {
        pontosJogador++;
      }
      golSom.play();
      falaPontos();
      this.reset();
    }
    if (this.y < this.r || this.y > height - this.r) {
      this.velY *= -1;
    }

    if (colideRetanguloCirculo(this.x, this.y, this.r, jogador.x, jogador.y, jogador.w, jogador.h) ||
    colideRetanguloCirculo(this.x, this.y, this.r, computador.x, computador.y, computador.w, computador.h)) {
      quicarSom.play();
      this.velX *= -1;
      this.velY *= 1.1;
      this.velX *= 1.1;
    }
  }

  desenha() {
    push();
    translate(this.x, this.y);
    rotate(this.angulo);
    imageMode(CENTER);
    image(bolaImg, 0, 0, this.r * 2, this.r * 2);
    pop();
  }
}

function colideRetanguloCirculo(cx, cy, raio, x, y, w, h) {
  // se o círculo está a esquerda ou a direita do retângulo
  if (cx + raio < x || cx - raio > x + w) {
      return false;
  }
  // se o círculo está acima ou abaixo do retângulo
  if (cy + raio < y || cy - raio > y + h) {
      return false;
  }
  return true;
}

function falaPontos() {
  if ("speechSynthesis" in window) {
    const pontuacao =
      "Pontuação é " +
      pontosJogador +
      " para o jogador e " +
      pontosComputador +
      " para o computador";
    const msg = new SpeechSynthesisUtterance(pontuacao);
    msg.lang = "pt-BR";
    window.speechSynthesis.speak(msg);
  }
}

let bola;
let jogador;
let computador;

function preload() {
  bolaImg = loadImage("img/bola.png");
  jogadorImg = loadImage("img/raquete2.png");
  computadorImg = loadImage("img/raquete.png");
  fundoImg = loadImage("img/fundo.png");
  quicarSom = loadSound("sound/click.wav");
  golSom = loadSound("sound/golSong.wav");
}

function setup() {
  createCanvas(800, 400);
  bola = new Bola();
  jogador = new Raquete(20);
  computador = new Raquete(width - 50 - 30);
}

function draw() {
  let canvasAspectRatio = width / height;
  let fundoAspectRatio = fundoImg.width / fundoImg.height;
  let zoom = 1;
  if (canvasAspectRatio > fundoAspectRatio) {
    zoom = width / fundoImg.width;
  } else {
    zoom = height / fundoImg.height;
  }
  let scaledWidth = fundoImg.width * zoom;
  let scaledHeight = fundoImg.height * zoom;
  image(
    fundoImg,
    (width - scaledWidth) / 2,
    (height - scaledHeight) / 2,
    scaledWidth,
    scaledHeight
  );

  bola.update();
  bola.desenha();
  jogador.update();
  jogador.desenha();
  computador.update();
  computador.desenha();
}
