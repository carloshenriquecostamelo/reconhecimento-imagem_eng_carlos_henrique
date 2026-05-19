# pyrefly: ignore [missing-import]
import pygame
import sys
from settings import *
from player import Player
from bullet import Bullet
from asteroid import Asteroid

class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("Atari Space Shooter")
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont(None, 48)
        self.running = True
        self.reset()

    def reset(self):
        self.game_over = False
        self.score = 0
        
        self.all_sprites = pygame.sprite.Group()
        self.asteroids = pygame.sprite.Group()
        self.bullets = pygame.sprite.Group()
        
        self.player = Player()
        self.all_sprites.add(self.player)

        self.spawn_timer = 0
        # Iniciar com apenas 1 asteroide
        self.new_asteroid()

    def new_asteroid(self):
        # Aumenta a velocidade em 20% a cada 100 pontos
        speed_multiplier = 1.0 + (self.score / 500.0)
        ast = Asteroid(speed_multiplier)
        self.all_sprites.add(ast)
        self.asteroids.add(ast)

    def events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            
            if not self.game_over:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        now = pygame.time.get_ticks()
                        if now - self.player.last_shot > self.player.shoot_delay:
                            self.player.last_shot = now
                            bullet = Bullet(self.player.rect.centerx, self.player.rect.top)
                            self.all_sprites.add(bullet)
                            self.bullets.add(bullet)
            else:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_r:
                        self.reset()

    def update(self):
        if not self.game_over:
            self.all_sprites.update()
            
            # Checar colisões Tiro <-> Asteroide
            hits = pygame.sprite.groupcollide(self.asteroids, self.bullets, True, True)
            for hit in hits:
                self.score += 10
                self.new_asteroid() # Substitui o destruído
                
            # Checar colisões Jogador <-> Asteroide
            hits = pygame.sprite.spritecollide(self.player, self.asteroids, False)
            if hits:
                self.game_over = True
                
            # Checar se asteroide passou do fundo
            for ast in self.asteroids:
                if ast.rect.top >= HEIGHT:
                    self.game_over = True
            
            # Spawn de asteroides ajustável pela pontuação
            self.spawn_timer += 1
            # Começa em 90 frames (1.5s) e diminui conforme a pontuação até o mínimo de 30 frames (0.5s)
            spawn_delay = max(30, 90 - (self.score // 5)) 
            if self.spawn_timer > spawn_delay:
                self.new_asteroid()
                self.spawn_timer = 0

    def draw(self):
        self.screen.fill(BLACK)
        self.all_sprites.draw(self.screen)
        
        # Desenhar pontuação
        score_text = self.font.render(f"Pontos: {self.score}", True, WHITE)
        self.screen.blit(score_text, (10, 10))
        
        if self.game_over:
            game_over_text = self.font.render("GAME OVER!", True, RED)
            text_rect = game_over_text.get_rect(center=(WIDTH/2, HEIGHT/2 - 30))
            self.screen.blit(game_over_text, text_rect)
            
            restart_font = pygame.font.SysFont(None, 36)
            restart_text = restart_font.render(f"Pontuação Final: {self.score} - Pressione R para reiniciar", True, WHITE)
            restart_rect = restart_text.get_rect(center=(WIDTH/2, HEIGHT/2 + 20))
            self.screen.blit(restart_text, restart_rect)
            
        pygame.display.flip()

    def run(self):
        while self.running:
            self.clock.tick(FPS)
            self.events()
            self.update()
            self.draw()
            
        pygame.quit()
        sys.exit()

if __name__ == "__main__":
    game = Game()
    game.run()
