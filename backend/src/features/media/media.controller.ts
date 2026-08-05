import { Request, Response } from 'express';
import { MediaService } from './media.service';
import { ApiResponseHandler, asyncHandler, AuthenticatedRequest } from '@/common';
import { HttpError } from '@/common/http-error';

/**
 * Media controller for media endpoints
 */
export class MediaController {
  private mediaService: MediaService;

  constructor() {
    this.mediaService = new MediaService();
  }

  /**
   * GET /media/hotels/:hotelId/images
   * Get hotel images
   */
  getHotelImages = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = parseInt(req.params.hotelId as string);

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    const images = await this.mediaService.getHotelImages(hotelId);

    return ApiResponseHandler.success(res, images);
  });

  /**
   * GET /media/hotels/images/:imageId
   * Get hotel image by ID
   */
  getHotelImageById = asyncHandler(async (req: Request, res: Response) => {
    const imageId = parseInt(req.params.imageId as string);

    if (!Number.isInteger(imageId)) {
      throw HttpError.badRequest('Image ID must be a numeric value');
    }

    const image = await this.mediaService.getHotelImageById(imageId);

    return ApiResponseHandler.success(res, image);
  });

  /**
   * POST /media/hotels/:hotelId/images
   * Upload hotel image
   */
  uploadHotelImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const hotelId = parseInt(req.params.hotelId as string);
    const { imageUrl, isPrimary = false, orderIndex = 0 } = req.body;

    if (!Number.isInteger(hotelId)) {
      throw HttpError.badRequest('Hotel ID must be a numeric value');
    }

    if (!imageUrl) {
      throw HttpError.badRequest('Image URL is required');
    }

    const image = await this.mediaService.uploadHotelImage(hotelId, {
      imageUrl,
      isPrimary,
      orderIndex,
    });

    return ApiResponseHandler.created(res, image);
  });

  /**
   * PUT /media/hotels/images/:imageId
   * Update hotel image
   */
  updateHotelImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const imageId = parseInt(req.params.imageId as string);

    if (!Number.isInteger(imageId)) {
      throw HttpError.badRequest('Image ID must be a numeric value');
    }

    const image = await this.mediaService.updateHotelImage(imageId, req.body);

    return ApiResponseHandler.success(res, image);
  });

  /**
   * DELETE /media/hotels/images/:imageId
   * Delete hotel image
   */
  deleteHotelImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const imageId = parseInt(req.params.imageId as string);

    if (!Number.isInteger(imageId)) {
      throw HttpError.badRequest('Image ID must be a numeric value');
    }

    await this.mediaService.deleteHotelImage(imageId);

    return ApiResponseHandler.success(res, null, 'Hotel image deleted successfully');
  });

  /**
   * POST /media/hotels/:hotelId/images/:imageId/primary
   * Set primary image
   */
  setPrimaryImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const hotelId = parseInt(req.params.hotelId as string);
    const imageId = parseInt(req.params.imageId as string);

    if (!Number.isInteger(hotelId) || !Number.isInteger(imageId)) {
      throw HttpError.badRequest('Hotel ID and Image ID must be numeric values');
    }

    await this.mediaService.setPrimaryImage(hotelId, imageId);

    return ApiResponseHandler.success(res, null, 'Primary image set successfully');
  });

  /**
   * GET /media/hotel-requests/:requestId/images
   * Get hotel request images
   */
  getHotelRequestImages = asyncHandler(async (req: Request, res: Response) => {
    const requestId = parseInt(req.params.requestId as string);

    if (!Number.isInteger(requestId)) {
      throw HttpError.badRequest('Request ID must be a numeric value');
    }

    const images = await this.mediaService.getHotelRequestImages(requestId);

    return ApiResponseHandler.success(res, images);
  });

  /**
   * GET /media/hotel-requests/images/:imageId
   * Get hotel request image by ID
   */
  getHotelRequestImageById = asyncHandler(async (req: Request, res: Response) => {
    const imageId = parseInt(req.params.imageId as string);

    if (!Number.isInteger(imageId)) {
      throw HttpError.badRequest('Image ID must be a numeric value');
    }

    const image = await this.mediaService.getHotelRequestImageById(imageId);

    return ApiResponseHandler.success(res, image);
  });

  /**
   * POST /media/hotel-requests/:requestId/images
   * Upload hotel request image
   */
  uploadHotelRequestImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const requestId = parseInt(req.params.requestId as string);
    const { imageUrl, orderIndex = 0 } = req.body;

    if (!Number.isInteger(requestId)) {
      throw HttpError.badRequest('Request ID must be a numeric value');
    }

    if (!imageUrl) {
      throw HttpError.badRequest('Image URL is required');
    }

    const image = await this.mediaService.uploadHotelRequestImage(requestId, {
      imageUrl,
      orderIndex,
    });

    return ApiResponseHandler.created(res, image);
  });

  /**
   * PUT /media/hotel-requests/images/:imageId
   * Update hotel request image
   */
  updateHotelRequestImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const imageId = parseInt(req.params.imageId as string);

    if (!Number.isInteger(imageId)) {
      throw HttpError.badRequest('Image ID must be a numeric value');
    }

    const image = await this.mediaService.updateHotelRequestImage(imageId, req.body);

    return ApiResponseHandler.success(res, image);
  });

  /**
   * DELETE /media/hotel-requests/images/:imageId
   * Delete hotel request image
   */
  deleteHotelRequestImage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const imageId = parseInt(req.params.imageId as string);

    if (!Number.isInteger(imageId)) {
      throw HttpError.badRequest('Image ID must be a numeric value');
    }

    await this.mediaService.deleteHotelRequestImage(imageId);

    return ApiResponseHandler.success(res, null, 'Hotel request image deleted successfully');
  });

  /**
   * POST /media/hotels/images/bulk-delete
   * Bulk delete hotel images
   */
  bulkDeleteHotelImages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const { imageIds } = req.body;

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      throw HttpError.badRequest('Image IDs array is required');
    }

    const result = await this.mediaService.bulkDeleteHotelImages(imageIds);

    return ApiResponseHandler.success(res, result);
  });

  /**
   * POST /media/hotel-requests/images/bulk-delete
   * Bulk delete hotel request images
   */
  bulkDeleteHotelRequestImages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userId) {
      throw HttpError.unauthorized();
    }

    const { imageIds } = req.body;

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      throw HttpError.badRequest('Image IDs array is required');
    }

    const result = await this.mediaService.bulkDeleteHotelRequestImages(imageIds);

    return ApiResponseHandler.success(res, result);
  });
}
