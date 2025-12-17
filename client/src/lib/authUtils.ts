/**
 * QuickAuth: Guest-only authentication utilities
 *
 * This file provides authentication utilities for guest-only mode.
 * All authentication is disabled for the hackathon build.
 */
export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
}
