export interface ConnectedPlatform {
  platform: 'codeforces' | 'leetcode' | 'codechef';
  url: string;
  username: string;
  lastSyncTime: string | null;
  problemsSynced: number;
  contestsSynced: number;
}

const STORAGE_KEY = "interview_prep_ai_platforms";

export class PlatformStorage {
  static getConnections(): Record<string, ConnectedPlatform> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as Record<string, ConnectedPlatform>;
        let needsMigration = false;
        
        // Migrate old connections that only stored username in URL field
        Object.values(parsed).forEach(conn => {
          if (conn.url && !conn.url.startsWith('http')) {
            needsMigration = true;
            if (conn.platform === 'codeforces') conn.url = `https://codeforces.com/profile/${conn.url}`;
            else if (conn.platform === 'leetcode') conn.url = `https://leetcode.com/u/${conn.url}/`;
            else if (conn.platform === 'codechef') conn.url = `https://www.codechef.com/users/${conn.url}`;
          }
        });
        
        if (needsMigration) {
           localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse platform connections from localStorage", e);
    }
    return {};
  }

  static saveConnection(platform: ConnectedPlatform): void {
    const connections = this.getConnections();
    connections[platform.platform] = platform;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }

  static removeConnection(platformId: string): void {
    const connections = this.getConnections();
    delete connections[platformId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
  }

  static updateSyncData(platformId: string, updates: Partial<ConnectedPlatform>): void {
    const connections = this.getConnections();
    if (connections[platformId]) {
      connections[platformId] = { ...connections[platformId], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(connections));
    }
  }

  // --- Analytics Cache ---
  static getCachedReport(url: string): any | null {
    try {
      const cacheData = localStorage.getItem(`report_cache_${url}`);
      if (cacheData) {
        const { timestamp, data } = JSON.parse(cacheData);
        // 15 minutes TTL
        if (Date.now() - timestamp < 15 * 60 * 1000) {
          return data;
        }
      }
    } catch (e) {
      console.error("Failed to read report cache", e);
    }
    return null;
  }

  static setCachedReport(url: string, data: any): void {
    try {
      localStorage.setItem(
        `report_cache_${url}`,
        JSON.stringify({ timestamp: Date.now(), data })
      );
    } catch (e) {
      console.error("Failed to save report cache", e);
    }
  }
}
