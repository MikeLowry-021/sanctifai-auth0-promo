/**
 * QuickAuth: Guest-only authentication stub
 *
 * This hook provides a pure guest experience with no network requests.
 * All authentication is disabled for the hackathon build.
 */
export function useAuth() {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
}
