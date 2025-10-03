-- CreateTable
CREATE TABLE "access_keys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assessmentTypes" TEXT NOT NULL DEFAULT 'OCAI,BALDRIGE',
    "maxUses" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "access_keys_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "subscribedAssessments" TEXT NOT NULL DEFAULT 'OCAI,BALDRIGE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "organizations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_organizations" ("consentVersion", "country", "createdAt", "dataRetentionDays", "id", "industry", "logoUrl", "name", "primaryColor", "privacyPolicyUrl", "settings", "size", "updatedAt") SELECT "consentVersion", "country", "createdAt", "dataRetentionDays", "id", "industry", "logoUrl", "name", "primaryColor", "privacyPolicyUrl", "settings", "size", "updatedAt" FROM "organizations";
DROP TABLE "organizations";
ALTER TABLE "new_organizations" RENAME TO "organizations";
CREATE TABLE "new_surveys" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "assessmentType" TEXT NOT NULL DEFAULT 'OCAI',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "openAt" DATETIME,
    "closeAt" DATETIME,
    "allowAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "requireOrgEmailDomain" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "surveys_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_surveys" ("allowAnonymous", "closeAt", "createdAt", "id", "openAt", "organizationId", "requireOrgEmailDomain", "status", "title", "updatedAt") SELECT "allowAnonymous", "closeAt", "createdAt", "id", "openAt", "organizationId", "requireOrgEmailDomain", "status", "title", "updatedAt" FROM "surveys";
DROP TABLE "surveys";
ALTER TABLE "new_surveys" RENAME TO "surveys";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'EMPLOYEE',
    "organizationId" TEXT,
    "accessKeyUsed" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastLoginAt" DATETIME,
    CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_users" ("createdAt", "email", "id", "name", "organizationId", "role", "updatedAt") SELECT "createdAt", "email", "id", "name", "organizationId", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "access_keys_key_key" ON "access_keys"("key");
