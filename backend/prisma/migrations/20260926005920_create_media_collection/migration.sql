-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'TV');

-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('WATCHLIST', 'WATCHING', 'WATCHED');

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "type" "MediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "posterPath" TEXT,
    "backdropPath" TEXT,
    "releaseDate" DATE,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMedia" (
    "id" SERIAL NOT NULL,
    "status" "MediaStatus" NOT NULL DEFAULT 'WATCHLIST',
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieWatchHistory" (
    "id" SERIAL NOT NULL,
    "runtimeMinutes" INTEGER,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userMediaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieWatchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchedEpisode" (
    "id" SERIAL NOT NULL,
    "tmdbEpisodeId" INTEGER NOT NULL,
    "seasonNumber" INTEGER NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "runtimeMinutes" INTEGER,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userMediaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchedEpisode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_tmdbId_type_key" ON "Media"("tmdbId", "type");

-- CreateIndex
CREATE INDEX "UserMedia_userId_status_idx" ON "UserMedia"("userId", "status");

-- CreateIndex
CREATE INDEX "UserMedia_userId_favorite_idx" ON "UserMedia"("userId", "favorite");

-- CreateIndex
CREATE UNIQUE INDEX "UserMedia_userId_mediaId_key" ON "UserMedia"("userId", "mediaId");

-- CreateIndex
CREATE INDEX "MovieWatchHistory_userMediaId_watchedAt_idx" ON "MovieWatchHistory"("userMediaId", "watchedAt");

-- CreateIndex
CREATE INDEX "WatchedEpisode_userMediaId_watchedAt_idx" ON "WatchedEpisode"("userMediaId", "watchedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WatchedEpisode_userMediaId_tmdbEpisodeId_key" ON "WatchedEpisode"("userMediaId", "tmdbEpisodeId");

-- AddForeignKey
ALTER TABLE "UserMedia" ADD CONSTRAINT "UserMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMedia" ADD CONSTRAINT "UserMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieWatchHistory" ADD CONSTRAINT "MovieWatchHistory_userMediaId_fkey" FOREIGN KEY ("userMediaId") REFERENCES "UserMedia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchedEpisode" ADD CONSTRAINT "WatchedEpisode_userMediaId_fkey" FOREIGN KEY ("userMediaId") REFERENCES "UserMedia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
