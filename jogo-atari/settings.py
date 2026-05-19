# settings.py
# Configurações globais do jogo

# Dimensões da tela
WIDTH = 800
HEIGHT = 600

# Taxa de atualização (FPS)
FPS = 60

# Cores (Estilo retrô)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
YELLOW = (255, 255, 0)

# Configurações da Nave
PLAYER_WIDTH = 40
PLAYER_HEIGHT = 40
PLAYER_SPEED = 5
PLAYER_COLOR = GREEN

# Configurações do Tiro
BULLET_WIDTH = 5
BULLET_HEIGHT = 15
BULLET_SPEED = -10 # Move para cima
BULLET_COLOR = YELLOW

# Configurações do Asteroide
ASTEROID_MIN_SIZE = 20
ASTEROID_MAX_SIZE = 50
ASTEROID_MIN_SPEED = 2
ASTEROID_MAX_SPEED = 6
ASTEROID_COLOR = WHITE
