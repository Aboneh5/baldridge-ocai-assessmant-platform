-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "industry" TEXT,
    "size" TEXT,
    "country" TEXT,
    "logoUrl" TEXT,
    "settings" JSONB,
    "primaryColor" TEXT DEFAULT '#3B82F6',
    "dataRetentionDays" INTEGER NOT NULL DEFAULT 2555,
    "privacyPolicyUrl" TEXT,
    "consentVersion" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_organizations" ("country", "createdAt", "id", "industry", "logoUrl", "name", "settings", "size", "updatedAt") SELECT "country", "createdAt", "id", "industry", "logoUrl", "name", "settings", "size", "updatedAt" FROM "organizations";
DROP TABLE "organizations";
ALTER TABLE "new_organizations" RENAME TO "organizations";
CREATE TABLE "new_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surveyId" TEXT NOT NULL,
    "userId" TEXT,
    "demographics" JSONB,
    "nowScores" JSONB NOT NULL,
    "preferredScores" JSONB NOT NULL,
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentTimestamp" DATETIME,
    "consentVersion" TEXT,
    "anonymousMode" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "responses_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_responses" ("demographics", "id", "ipHash", "nowScores", "preferredScores", "submittedAt", "surveyId", "userId") SELECT "demographics", "id", "ipHash", "nowScores", "preferredScores", "submittedAt", "surveyId", "userId" FROM "responses";
DROP TABLE "responses";
ALTER TABLE "new_responses" RENAME TO "responses";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
