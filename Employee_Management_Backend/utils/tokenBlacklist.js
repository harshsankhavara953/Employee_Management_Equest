/**
 * Token Blacklist Utility
 * Manages blacklisted JWT tokens for secure logout functionality
 */

class TokenBlacklist {
    constructor() {
        this.blacklistedTokens = new Set();
        this.tokenExpiry = new Map(); // Store token expiry times for cleanup
    }

    /**
     * Add a token to the blacklist
     * @param {string} token - JWT token to blacklist
     * @param {number} expiresAt - Token expiration timestamp
     */
    addToken(token, expiresAt) {
        this.blacklistedTokens.add(token);
        this.tokenExpiry.set(token, expiresAt);

        // Schedule cleanup for when token expires
        const timeUntilExpiry = expiresAt - Date.now();
        if (timeUntilExpiry > 0) {
            setTimeout(() => {
                this.removeExpiredToken(token);
            }, timeUntilExpiry);
        }
    }

    /**
     * Check if a token is blacklisted
     * @param {string} token - JWT token to check
     * @returns {boolean} - True if token is blacklisted
     */
    isBlacklisted(token) {
        return this.blacklistedTokens.has(token);
    }

    /**
     * Remove an expired token from blacklist
     * @param {string} token - Token to remove
     */
    removeExpiredToken(token) {
        this.blacklistedTokens.delete(token);
        this.tokenExpiry.delete(token);
    }

    /**
     * Clean up all expired tokens
     */
    cleanupExpiredTokens() {
        const now = Date.now();
        for (const [token, expiry] of this.tokenExpiry.entries()) {
            if (expiry <= now) {
                this.removeExpiredToken(token);
            }
        }
    }

    /**
     * Get blacklist statistics
     * @returns {object} - Blacklist stats
     */
    getStats() {
        return {
            totalBlacklistedTokens: this.blacklistedTokens.size,
            memoryUsage: process.memoryUsage()
        };
    }

    /**
     * Clear all blacklisted tokens (for testing)
     */
    clear() {
        this.blacklistedTokens.clear();
        this.tokenExpiry.clear();
    }
}

// Create singleton instance
const tokenBlacklist = new TokenBlacklist();

// Cleanup expired tokens every hour
setInterval(() => {
    tokenBlacklist.cleanupExpiredTokens();
}, 60 * 60 * 1000);

export default tokenBlacklist;
