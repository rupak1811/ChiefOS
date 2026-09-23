-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActionLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "agentId" TEXT,
    "action" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "metadata" TEXT,
    "result" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delegationChain" TEXT DEFAULT '[]',
    "toolArgsHash" TEXT,
    "hitl" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ActionLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActionLedger_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ActionLedger" ("action", "agentId", "delegationChain", "hitl", "id", "metadata", "result", "scope", "timestamp", "toolArgsHash", "userId") SELECT "action", "agentId", "delegationChain", "hitl", "id", "metadata", "result", "scope", "timestamp", "toolArgsHash", "userId" FROM "ActionLedger";
DROP TABLE "ActionLedger";
ALTER TABLE "new_ActionLedger" RENAME TO "ActionLedger";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
