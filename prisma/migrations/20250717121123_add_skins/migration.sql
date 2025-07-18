-- CreateEnum
CREATE TYPE "Character" AS ENUM ('MARIO', 'LUIGI', 'PEACH', 'DAISY', 'ROSALINA', 'PAULINE', 'YOSHI', 'BIRDO', 'TOAD', 'TOADETTE', 'BABY_MARIO', 'BABY_LUIGI', 'BABY_PEACH', 'BABY_DAISY', 'BABY_ROSALINA', 'BOWSER', 'BOWSER_JR', 'GOOMBA', 'KOOPA_TROOPA', 'DRY_BONES', 'PIRANHA_PLANT', 'HAMMER_BRO', 'CHARGIN_CHUCK', 'MONTY_MOLE', 'POKEY', 'PARA_BIDDYBUD', 'SPIKE', 'SHY_GUY', 'WIGGLER', 'KING_BOO', 'PEEPA', 'DONKEY_KONG', 'WARIO', 'WALUIGI', 'NABBIT', 'PIANTA', 'MOO_MOO', 'PENGUIN', 'SIDESTEPPER', 'SNOWMAN', 'SWOOP', 'STINGBY', 'CATAQUACK', 'CHEEP_CHEEP', 'FISH_BONE', 'DOLPHIN', 'ROCKY_WRENCH', 'COIN_COFFER', 'CONKDOR', 'LAKITU');

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "character" "Character",

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "character" "Character" NOT NULL,

    CONSTRAINT "Skin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");
