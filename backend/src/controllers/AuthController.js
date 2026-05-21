const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Role } = require('../models');
const {
  sendSuccess,
  sendConflict,       // ⚠️  Add this to your apiResponse utils if not already present
  sendBadRequest,
  sendInternalError,
  sendUnauthorized,
} = require('../utils/apiResponse');

// ─── Startup validation ────────────────────────────────────────────────────────
// Fail fast rather than silently falling back to a weaker secret
if (!process.env.JWT_SECRET) throw new Error('Missing required env var: JWT_SECRET');

// ─── Constants ─────────────────────────────────────────────────────────────────
const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';

// ─── Duration helpers ──────────────────────────────────────────────────────────
const parseDurationMs = (duration, fallbackMs) => {
  if (!duration) return fallbackMs;

  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return fallbackMs;

  const value = Number(match[1]);
  const unitMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * unitMs[match[2]];
};

// Single source of truth — both the JWT expiry and the cookie maxAge derive
// from this value, so they can never drift out of sync.
const REFRESH_EXPIRY_MS = parseDurationMs(
  process.env.JWT_REFRESH_EXPIRES_IN,
  30 * 24 * 60 * 60 * 1000
);

// ─── Cookie helpers ────────────────────────────────────────────────────────────
const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite:
    process.env.REFRESH_TOKEN_COOKIE_SAME_SITE ||
    (process.env.NODE_ENV === 'production' ? 'none' : 'lax'),
  path: '/api/auth',
  maxAge: REFRESH_EXPIRY_MS,
});

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getRefreshTokenCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...getRefreshTokenCookieOptions(),
    maxAge: undefined,
  });
};

// ─── Token generators ──────────────────────────────────────────────────────────
const generateAccessToken = (id) =>
  jwt.sign({ id, type: 'access' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

// Opaque refresh token: a random string with no embedded user data.
// Stored only as a hash in the database; delivered via httpOnly cookie.
const generateOpaqueRefreshToken = () => crypto.randomBytes(32).toString('base64url');

const issueRefreshTokenForUser = async ({ userId }) => {
  const refreshToken = generateOpaqueRefreshToken();

  const refreshTokenRow = await RefreshToken.create({
    userId,
    tokenHash: sha256(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_EXPIRY_MS),
  });

  return { refreshToken, refreshTokenRow };
};

// ─── Payload builder ───────────────────────────────────────────────────────────
// Returns only user data — access token is kept separate in the response.
// Role may already be eager-loaded via `include`; avoids a redundant query if so.
const buildUserPayload = async (user) => {
  const role = user.role ?? user.Role ?? (await Role.findByPk(user.roleId));

  return {
    id: user.id,           // `_id` is a MongoDB convention; use `id` for SQL
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: role?.key ?? 'customer',
    roleId: user.roleId,
  };
};

// ─── Controllers ──────────────────────────────────────────────────────────────

exports.register = async (req, res) => {
  // Role is never accepted from the client — public registration always
  // creates a customer. Elevated roles must be assigned through protected
  // endpoints (e.g., admin inviting an owner).
  const { firstName, lastName, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      // 409 Conflict — semantically more accurate than 400 for a duplicate
      return sendConflict(res, 'An account with this email already exists');
    }

    const customerRole = await Role.findOne({ where: { key: 'customer' } });

    if (!customerRole) {
      console.error('[register] customer role missing from database');
      return sendInternalError(res, 'Something went wrong');
    }

    const user = await User.create({
      firstName,
      lastName,
      phone,
      email,
      password,
      roleId: customerRole.id,
    });

    const { refreshToken } = await issueRefreshTokenForUser({ userId: user.id });
    setRefreshTokenCookie(res, refreshToken);

    return sendSuccess(
      res,
      {
        data: {
          user: await buildUserPayload(user),
          accessToken: generateAccessToken(user.id),
        },
        message: 'User registered successfully',
      },
      201
    );
  } catch (error) {
    console.error('[register]', error);
    return sendInternalError(res, 'Something went wrong');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Eager-load Role to avoid an extra query in buildUserPayload
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }],
    });

    // Unified error — avoids leaking whether an email is registered (enumeration)
    if (!user || !(await user.comparePassword(password))) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    const { refreshToken } = await issueRefreshTokenForUser({ userId: user.id });
    setRefreshTokenCookie(res, refreshToken);
    // console.log('refreshToken: ', refreshToken.slice(8));

    return sendSuccess(res, {
      data: {
        user: await buildUserPayload(user),
        accessToken: generateAccessToken(user.id),
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('[login]', error);
    return sendInternalError(res, 'Something went wrong');
  }
};

exports.refresh = async (req, res) => {
  // Requires cookie-parser middleware registered in app.js:
  // app.use(require('cookie-parser')());
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    return sendUnauthorized(res, 'Refresh token is required');
  }

  try {
    const tokenRow = await RefreshToken.findOne({
      where: { tokenHash: sha256(refreshToken) },
    });

    if (!tokenRow) {
      return sendUnauthorized(res, 'Invalid refresh token');
    }

    // If the token was already used (revoked), treat it as a reuse attack:
    // revoke all outstanding tokens for the user so the attacker can't keep
    // refreshing with a stolen token chain.
    if (tokenRow.revokedAt) {
      await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: tokenRow.userId, revokedAt: null } });
      clearRefreshTokenCookie(res);
      return sendUnauthorized(res, 'Invalid refresh token');
    }

    if (tokenRow.expiresAt.getTime() <= Date.now()) {
      return sendUnauthorized(res, 'Refresh token expired');
    }

    const user = await User.findByPk(tokenRow.userId, {
      include: [{ model: Role, as: 'role' }],
    });

    if (!user) {
      clearRefreshTokenCookie(res);
      return sendUnauthorized(res, 'Invalid refresh token');
    }

    // Rotate: mint a new refresh token and atomically revoke the old one.
    const { refreshToken: nextRefreshToken, refreshTokenRow: nextRow } =
      await issueRefreshTokenForUser({ userId: tokenRow.userId });

    tokenRow.revokedAt = new Date();
    tokenRow.replacedByTokenId = nextRow.id;
    await tokenRow.save();

    setRefreshTokenCookie(res, nextRefreshToken);

    return sendSuccess(res, {
      data: {
        user: await buildUserPayload(user),
        accessToken: generateAccessToken(user.id),
      },
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    console.error('[refresh]', error);
    return sendInternalError(res, 'Something went wrong');
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (refreshToken) {
    try {
      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { tokenHash: sha256(refreshToken), revokedAt: null } }
      );
    } catch {
      // Ignore invalid/expired tokens on logout — cookie is cleared regardless.
    }
  }

  clearRefreshTokenCookie(res);

  return sendSuccess(res, {
    data: null,
    message: 'Logged out successfully',
  });
};
