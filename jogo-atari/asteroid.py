# pyrefly: ignore [missing-import]
import pygame
import random
from settings import *

class Asteroid(pygame.sprite.Sprite):
    def __init__(self, speed_multiplier=1.0):
        super().__init__()
        size = random.randint(ASTEROID_MIN_SIZE, ASTEROID_MAX_SIZE)
        self.image = pygame.Surface((size, size))
        self.image.fill(ASTEROID_COLOR)
        self.rect = self.image.get_rect()
        self.rect.x = random.randint(0, WIDTH - size)
        self.rect.y = random.randint(-100, -40)
        
        base_speed = random.randint(ASTEROID_MIN_SPEED, ASTEROID_MAX_SPEED)
        self.speedy = max(1, int(base_speed * speed_multiplier))

    def update(self):
        self.rect.y += self.speedy
        # Se passar da tela, é destruído (será tratado no main.py para dar Game Over)
        if self.rect.top > HEIGHT:
            self.kill()
