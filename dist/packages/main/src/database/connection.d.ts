import Database from 'better-sqlite3';
export declare function initializeDatabase(): Promise<void>;
export declare function getDatabase(): import("drizzle-orm/better-sqlite3").BetterSQLite3Database<Record<string, unknown>>;
export declare function getRawDatabase(): Database.Database;
export declare function checkDatabaseHealth(): {
    isHealthy: boolean;
    details: any;
};
export declare function closeDatabase(): void;
//# sourceMappingURL=connection.d.ts.map