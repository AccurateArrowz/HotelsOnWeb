# Staff Invitation Feature - Setup Guide

## Quick Start

### 1. Environment Configuration

Add to your `.env` file in the `backend/` directory:

```env
# Resend Email Service (for sending invitations)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Frontend URL (used in invitation email links)
FRONTEND_URL=http://localhost:5173
```

**Note**: Get your Resend API key from [resend.com](https://resend.com)

### 2. Build Shared Package

```bash
npm run build:shared
```

This compiles the shared validation schemas and types.

### 3. Run Database Migration

```bash
cd backend
npm run migrate
```

This creates:
- `Invitations` table
- Adds `status` column to `HotelStaffs` table
- Creates indexes for performance

### 4. Verify Backend Build

```bash
cd backend
npm run build
```

Should compile without errors.

### 5. Start the Application

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

---

## Feature Usage

### For Hotel Owners

1. **Navigate to Staff Management**
   - Go to "My Hotel" dashboard
   - Click on the "Staff" tab in the sidebar

2. **Send Invitation**
   - Click "Send Invitation" button
   - Enter staff member's email
   - Select their role (Manager or Receptionist)
   - Click "Send Invitation"
   - Email is sent automatically via Resend

3. **Manage Pending Invitations**
   - View all pending invitations in the list
   - **Resend**: Click the refresh icon to resend the email
   - **Cancel**: Click the trash icon to cancel the invitation

### For Invited Staff

1. **Receive Email**
   - Staff member receives invitation email
   - Email includes hotel name, role, and inviter name
   - Contains a secure link to accept the invitation

2. **Accept Invitation**
   - Click the link in the email (or visit `/accept-invite?token=...`)
   - Fill in their profile:
     - First Name
     - Last Name
     - Password (6+ characters)
     - Phone (optional)
   - Click "Accept Invitation & Create Account"
   - Account is created and they can log in

---

## API Endpoints

### Public Endpoints

#### Get Invitation Details
```bash
GET /api/invitations/:token
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "hotelName": "Grand Hotel",
    "roleName": "Manager",
    "inviterName": "Jane Smith"
  }
}
```

#### Accept Invitation
```bash
POST /api/invitations/accept
Content-Type: application/json

{
  "token": "...",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123",
  "phone": "+1234567890"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 42,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "message": "Invitation accepted successfully"
  }
}
```

### Protected Endpoints (Owner Only)

#### Create Invitation
```bash
POST /api/invitations/hotels/:hotelId/invitations
Authorization: Bearer <token>
Content-Type: application/json

{
  "invitedEmail": "manager@example.com",
  "roleId": 4
}
```

#### Get Pending Invitations
```bash
GET /api/invitations/hotels/:hotelId/invitations?status=pending&limit=20&offset=0
Authorization: Bearer <token>
```

#### Resend Invitation Email
```bash
POST /api/invitations/hotels/:hotelId/invitations/:invitationId/resend
Authorization: Bearer <token>
```

#### Cancel Invitation
```bash
DELETE /api/invitations/hotels/:hotelId/invitations/:invitationId
Authorization: Bearer <token>
```

---

## Role IDs

The system uses these role IDs (from the Roles table):

| ID | Name | Scope | Description |
|----|------|-------|-------------|
| 1 | Customer | system | Regular guest/customer |
| 2 | Admin | system | System administrator |
| 3 | Owner | hotel | Hotel owner |
| 4 | Manager | hotel | Hotel manager |
| 5 | Receptionist | hotel | Hotel receptionist |

When inviting staff, use roleId `4` (Manager) or `5` (Receptionist).

---

## Testing

### Manual Testing Checklist

- [ ] Owner can navigate to Staff tab
- [ ] Owner can send invitation with valid email and role
- [ ] Email is sent (check Resend dashboard)
- [ ] Invitation appears in pending list
- [ ] Owner can resend invitation
- [ ] Owner can cancel invitation
- [ ] Staff can click email link and go to accept page
- [ ] Accept page shows correct hotel name and role
- [ ] Staff can create account with password
- [ ] Staff can log in with new account
- [ ] Staff appears in HotelStaff records with correct role

### Testing with Resend

1. Sign up at [resend.com](https://resend.com)
2. Create a project and get API key
3. Add API key to `.env`
4. Send test invitation
5. Check Resend dashboard for email delivery status

**Note**: Free Resend accounts can only send to verified email addresses. Add your test email to the verified list.

---

## Troubleshooting

### "Invitation token is required"
- Make sure the URL has `?token=...` query parameter
- Check that token is valid and not expired

### "Invitation has expired"
- Invitations expire after 7 days
- Owner should resend the invitation

### "Email already exists"
- The email address is already registered
- Staff member should use a different email or log in if they already have an account

### "You are not an owner of this hotel"
- Only hotel owners can send invitations
- User must be in the HotelOwner table for this hotel

### Email not received
- Check spam/junk folder
- Verify email address is correct
- Check Resend dashboard for delivery status
- Ensure RESEND_API_KEY is set correctly

---

## Security Notes

1. **Tokens**: 32-byte random tokens (256-bit entropy), expire after 7 days
2. **Passwords**: Hashed with bcryptjs (12 rounds)
3. **Email Validation**: Prevents duplicate invitations and existing user emails
4. **Role-Based Access**: Only owners can send invitations
5. **One-Time Use**: Tokens are marked as accepted after use

---

## Files Modified/Created

### Backend
- `src/features/invitation/` - New feature module
- `src/middleware/hotel-owner.middleware.ts` - New middleware
- `src/models/Invitation.ts` - New model
- `src/services/email.service.ts` - New email service
- `migrations/20260806120000-create-invitations-table.js` - New migration
- `src/app.ts` - Added invitation routes
- `src/features/hotel/hotel.controller.ts` - Added getMyHotels endpoint
- `src/features/hotel/hotel.routes.ts` - Added /owner/my-hotels route
- `src/models/Role.ts` - Fixed field mapping (key/label)

### Frontend
- `src/features/owner/components/InviteStaff.jsx` - New component
- `src/features/owner/components/InviteStaff.css` - New styles
- `src/features/owner/pages/AcceptInvitePage.jsx` - New page
- `src/features/owner/pages/AcceptInvitePage.css` - New styles
- `src/features/owner/invitationsApi.ts` - New RTK Query API
- `src/features/owner/pages/MyHotelPage.jsx` - Added Staff tab
- `src/app/App.jsx` - Added /accept-invite route

### Shared
- `src/schemas/invitation.schema.ts` - New validation schemas
- `src/index.ts` - Exported invitation schemas

---

## Next Steps

1. Set up Resend account and get API key
2. Add environment variables
3. Run migrations
4. Build and start the application
5. Test the feature end-to-end
6. Deploy to production

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the implementation documentation in `STAFF_INVITATION_IMPLEMENTATION.md`
3. Check Resend dashboard for email delivery status
4. Review backend logs for API errors
5. Check browser console for frontend errors
