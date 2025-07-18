import { Type } from 'class-transformer';
import { IsEnum, IsString, ValidateNested } from 'class-validator';

enum Character {
  MARIO = 'MARIO',
  PEACH = 'PEACH',
  YOSHI = 'YOSHI',
  LUIGI = 'LUIGI',
  SHY_GUY = 'SHY_GUY',
  DAISY = 'DAISY',
  ROSALINA = 'ROSALINA',
  TOAD = 'TOAD',
  BABY_ROSALINA = 'BABY_ROSALINA',
  WARIO = 'WARIO',
  TOADETTE = 'TOADETTE',
  BABY_MARIO = 'BABY_MARIO',
  BABY_LUIGI = 'BABY_LUIGI',
  BABY_PEACH = 'BABY_PEACH',
  BABY_DAISY = 'BABY_DAISY',
  BOWSER = 'BOWSER',
  DONKEY_KONG = 'DONKEY_KONG',
  WALUIGI = 'WALUIGI',
  GOOMBA = 'GOOMBA',
  KOOPA_TROOPA = 'KOOPA_TROOPA',
  PIRANHA_PLANT = 'PIRANHA_PLANT',
  HAMMER_BRO = 'HAMMER_BRO',
  CHARGIN_CHUCK = 'CHARGIN_CHUCK',
  MONTY_MOLE = 'MONTY_MOLE',
  POKEY = 'POKEY',
  PARA_BIDDYBUD = 'PARA_BIDDYBUD',
  SPIKE = 'SPIKE',
  WIGGLER = 'WIGGLER',
  NABBIT = 'NABBIT',
  PIANTA = 'PIANTA',
  MOO_MOO = 'MOO_MOO',
  PENGUIN = 'PENGUIN',
  SIDESTEPPER = 'SIDESTEPPER',
  SNOWMAN = 'SNOWMAN',
  STINGBY = 'STINGBY',
  CATAQUACK = 'CATAQUACK',
  CHEEP_CHEEP = 'CHEEP_CHEEP',
  FISH_BONE = 'FISH_BONE',
  DOLPHIN = 'DOLPHIN',
  ROCKY_WRENCH = 'ROCKY_WRENCH',
  LAKITU = 'LAKITU',
  DRY_BONES = 'DRY_BONES',
}

export class CreateSkinDto {
  @IsEnum(Character)
  character: Character;

  @IsString()
  name: string;
}

export class CreateManySkinsDto {
  @ValidateNested({ each: true })
  @Type(() => CreateSkinDto)
  skins: CreateSkinDto[];
}
