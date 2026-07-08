// Test access control logic for admin security panel

function checkAdminAccess(token: string | null, userJson: string | null): { authorized: boolean; redirect: string | null } {
  if (!token || !userJson) {
    return { authorized: false, redirect: '/login' };
  }
  try {
    const user = JSON.parse(userJson);
    if (user.role === 'ADMIN') {
      return { authorized: true, redirect: null };
    } else {
      return { authorized: false, redirect: '/login' };
    }
  } catch (e) {
    return { authorized: false, redirect: '/login' };
  }
}

describe('Admin Security Page Access Control Logic Tests', () => {
  test('should redirect to login if no token or user exists', () => {
    const result = checkAdminAccess(null, null);
    expect(result.authorized).toBe(false);
    expect(result.redirect).toBe('/login');
  });

  test('should redirect to login if user is not an admin', () => {
    const userJson = JSON.stringify({ username: 'user', role: 'USER' });
    const result = checkAdminAccess('some-token', userJson);
    expect(result.authorized).toBe(false);
    expect(result.redirect).toBe('/login');
  });

  test('should grant access if user is an admin', () => {
    const userJson = JSON.stringify({ username: 'admin', role: 'ADMIN' });
    const result = checkAdminAccess('admin-token', userJson);
    expect(result.authorized).toBe(true);
    expect(result.redirect).toBeNull();
  });
});
