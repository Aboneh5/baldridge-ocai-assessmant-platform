-- CreateTable
CREATE TABLE "baldrige_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "description" TEXT,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "baldrige_subcategories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "baldrige_subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "baldrige_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "baldrige_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemCode" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "instructions" TEXT,
    "metadata" JSONB,
    "subcategoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "baldrige_questions_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "baldrige_subcategories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "baldrige_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "surveyId" TEXT,
    "responseText" TEXT NOT NULL,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "baldrige_responses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "baldrige_responses_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "baldrige_questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "baldrige_responses_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "baldrige_progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "surveyId" TEXT,
    "completedQuestions" JSONB NOT NULL DEFAULT [],
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "baldrige_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "baldrige_progress_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "surveys" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "baldrige_categories_name_key" ON "baldrige_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "baldrige_categories_displayOrder_key" ON "baldrige_categories"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "baldrige_subcategories_categoryId_displayOrder_key" ON "baldrige_subcategories"("categoryId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "baldrige_questions_itemCode_key" ON "baldrige_questions"("itemCode");

-- CreateIndex
CREATE UNIQUE INDEX "baldrige_questions_subcategoryId_orderIndex_key" ON "baldrige_questions"("subcategoryId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "baldrige_responses_userId_questionId_surveyId_key" ON "baldrige_responses"("userId", "questionId", "surveyId");

-- CreateIndex
CREATE UNIQUE INDEX "baldrige_progress_userId_surveyId_key" ON "baldrige_progress"("userId", "surveyId");
