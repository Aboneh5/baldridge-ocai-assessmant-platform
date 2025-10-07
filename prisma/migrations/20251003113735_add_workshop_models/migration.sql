-- CreateTable
CREATE TABLE "workshops" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "surveyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "facilitatorId" TEXT,
    "scheduledAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workshops_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "workshops_facilitatorId_fkey" FOREIGN KEY ("facilitatorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workshop_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workshopId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "workshop_sessions_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pinned_charts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "chartType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pinned_charts_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workshop_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "themes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "themes_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workshop_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workshopId" TEXT NOT NULL,
    "sessionId" TEXT,
    "themeId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "owner" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "dueDate" DATETIME,
    "completedAt" DATETIME,
    "successMetrics" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "actions_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "actions_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "workshop_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "actions_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "themes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "interventions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "quadrant" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "effort" TEXT NOT NULL DEFAULT 'medium',
    "impact" TEXT NOT NULL DEFAULT 'medium',
    "duration" TEXT,
    "resources" TEXT,
    "examples" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
