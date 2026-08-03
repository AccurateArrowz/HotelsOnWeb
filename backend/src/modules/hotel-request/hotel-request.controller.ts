import { Request, Response } from 'express';
import { HotelRequestService } from './hotel-request.service';
import { ApiResponseHandler, asyncHandler, AuthenticatedRequest } from '@/common';
import { HttpError } from '@/common/http-error';

/**
 * Hotel request controller for hotel request endpoints
 */
export class HotelRequestController {
  private hotelRequestService: HotelRequestService;

  constructor() {
    this.hotelRequestService = new HotelRequestService();
  }

  /**
   * GET /hotel-requests
   * Get requests by user
   */
  getRequestsByUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const requests = await this.hotelRequestService.getRequestsByUser(req.userId);

    return ApiResponseHandler.success(res, requests);
  });

  /**
   * GET /hotel-requests/:id
   * Get request by ID
   */
  getRequestById = asyncHandler(async (req: Request, res: Response) => {
    const requestId = parseInt(req.params.id);

    if (!Number.isInteger(requestId)) {
      throw HttpError.badRequest('Request ID must be a numeric value');
    }

    const request = await this.hotelRequestService.getRequestById(requestId);

    return ApiResponseHandler.success(res, request);
  });

  /**
   * POST /hotel-requests
   * Create new hotel request
   */
  createRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const { hotelName, city, address, description, phone, email } = req.body;

    if (!hotelName || !city || !address) {
      throw HttpError.badRequest('Hotel name, city, and address are required');
    }

    const request = await this.hotelRequestService.createRequest(
      {
        hotelName,
        city,
        address,
        description,
        phone,
        email,
      },
      req.userId
    );

    return ApiResponseHandler.created(res, request);
  });

  /**
   * PUT /hotel-requests/:id
   * Update request
   */
  updateRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const requestId = parseInt(req.params.id);

    if (!Number.isInteger(requestId)) {
      throw HttpError.badRequest('Request ID must be a numeric value');
    }

    const request = await this.hotelRequestService.updateRequest(requestId, req.body);

    return ApiResponseHandler.success(res, request);
  });

  /**
   * POST /hotel-requests/:id/approve
   * Approve request
   */
  approveRequest = asyncHandler(async (req: Request, res: Response) => {
    const requestId = parseInt(req.params.id);

    if (!Number.isInteger(requestId)) {
      throw HttpError.badRequest('Request ID must be a numeric value');
    }

    const request = await this.hotelRequestService.approveRequest(requestId);

    return ApiResponseHandler.success(res, request, 'Request approved successfully');
  });

  /**
   * POST /hotel-requests/:id/reject
   * Reject request
   */
  rejectRequest = asyncHandler(async (req: Request, res: Response) => {
    const requestId = parseInt(req.params.id);
    const { reason } = req.body;

    if (!Number.isInteger(requestId)) {
      throw HttpError.badRequest('Request ID must be a numeric value');
    }

    const request = await this.hotelRequestService.rejectRequest(requestId, reason);

    return ApiResponseHandler.success(res, request, 'Request rejected successfully');
  });

  /**
   * GET /hotel-requests/status/:status
   * Get requests by status
   */
  getRequestsByStatus = asyncHandler(async (req: Request, res: Response) => {
    const { status } = req.params;

    const requests = await this.hotelRequestService.getRequestsByStatus(status);

    return ApiResponseHandler.success(res, requests);
  });

  /**
   * GET /hotel-requests/pending
   * Get pending requests
   */
  getPendingRequests = asyncHandler(async (req: Request, res: Response) => {
    const requests = await this.hotelRequestService.getPendingRequests();

    return ApiResponseHandler.success(res, requests);
  });

  /**
   * GET /hotel-requests/approved
   * Get approved requests
   */
  getApprovedRequests = asyncHandler(async (req: Request, res: Response) => {
    const requests = await this.hotelRequestService.getApprovedRequests();

    return ApiResponseHandler.success(res, requests);
  });

  /**
   * GET /hotel-requests/rejected
   * Get rejected requests
   */
  getRejectedRequests = asyncHandler(async (req: Request, res: Response) => {
    const requests = await this.hotelRequestService.getRejectedRequests();

    return ApiResponseHandler.success(res, requests);
  });

  /**
   * GET /hotel-requests/stats
   * Get request statistics
   */
  getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.hotelRequestService.getStatistics();

    return ApiResponseHandler.success(res, stats);
  });

  /**
   * GET /hotel-requests/search
   * Search requests
   */
  searchRequests = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q) {
      throw HttpError.badRequest('Search query is required');
    }

    const requests = await this.hotelRequestService.searchRequests(q as string);

    return ApiResponseHandler.success(res, requests);
  });

  /**
   * DELETE /hotel-requests/:id
   * Delete request
   */
  deleteRequest = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const requestId = parseInt(req.params.id);

    if (!Number.isInteger(requestId)) {
      throw HttpError.badRequest('Request ID must be a numeric value');
    }

    await this.hotelRequestService.deleteRequest(requestId);

    return ApiResponseHandler.success(res, null, 'Request deleted successfully');
  });
}
