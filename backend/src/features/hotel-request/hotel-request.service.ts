import { HotelRequestRepository } from './hotel-request.repository';
import { HttpError } from '@/common/http-error';

/**
 * Hotel request service for hotel request operations
 */
export class HotelRequestService {
  private hotelRequestRepository: HotelRequestRepository;

  constructor() {
    this.hotelRequestRepository = new HotelRequestRepository();
  }

  /**
   * Get requests by user
   */
  async getRequestsByUser(userId: number) {
    const requests = await this.hotelRequestRepository.findByUserId(userId);

    return requests;
  }

  /**
   * Get request by ID
   */
  async getRequestById(requestId: number) {
    const request = await this.hotelRequestRepository.findById(requestId);

    if (!request) {
      throw HttpError.notFound('Hotel request not found');
    }

    return request;
  }

  /**
   * Create new hotel request
   */
  async createRequest(data: any, userId: number) {
    const request = await this.hotelRequestRepository.create({
      ...data,
      userId,
      status: 'pending',
    });

    return request;
  }

  /**
   * Update request
   */
  async updateRequest(requestId: number, data: any) {
    const request = await this.hotelRequestRepository.findById(requestId);

    if (!request) {
      throw HttpError.notFound('Hotel request not found');
    }

    await this.hotelRequestRepository.update(requestId, data);

    return this.hotelRequestRepository.findById(requestId);
  }

  /**
   * Approve request
   */
  async approveRequest(requestId: number) {
    const request = await this.hotelRequestRepository.findById(requestId);

    if (!request) {
      throw HttpError.notFound('Hotel request not found');
    }

    if (request.status !== 'pending') {
      throw HttpError.conflict('Only pending requests can be approved');
    }

    await this.hotelRequestRepository.update(requestId, { status: 'approved' });

    return this.hotelRequestRepository.findById(requestId);
  }

  /**
   * Reject request
   */
  async rejectRequest(requestId: number, reason?: string) {
    const request = await this.hotelRequestRepository.findById(requestId);

    if (!request) {
      throw HttpError.notFound('Hotel request not found');
    }

    if (request.status !== 'pending') {
      throw HttpError.conflict('Only pending requests can be rejected');
    }

    await this.hotelRequestRepository.update(requestId, {
      status: 'rejected',
      rejectionReason: reason,
    });

    return this.hotelRequestRepository.findById(requestId);
  }

  /**
   * Get requests by status
   */
  async getRequestsByStatus(status: string) {
    const requests = await this.hotelRequestRepository.findByStatus(status);

    return requests;
  }

  /**
   * Get pending requests
   */
  async getPendingRequests() {
    const requests = await this.hotelRequestRepository.findPendingRequests();

    return requests;
  }

  /**
   * Get approved requests
   */
  async getApprovedRequests() {
    const requests = await this.hotelRequestRepository.findApprovedRequests();

    return requests;
  }

  /**
   * Get rejected requests
   */
  async getRejectedRequests() {
    const requests = await this.hotelRequestRepository.findRejectedRequests();

    return requests;
  }

  /**
   * Get request statistics
   */
  async getStatistics() {
    return this.hotelRequestRepository.getStatistics();
  }

  /**
   * Search requests
   */
  async searchRequests(query: string) {
    return this.hotelRequestRepository.search(query);
  }

  /**
   * Delete request
   */
  async deleteRequest(requestId: number) {
    const request = await this.hotelRequestRepository.findById(requestId);

    if (!request) {
      throw HttpError.notFound('Hotel request not found');
    }

    await this.hotelRequestRepository.delete(requestId);
  }
}
